import re
import unicodedata
from datetime import date, timedelta
from decimal import Decimal
from typing import Literal
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.category_repository import CategoryRepository
from app.schemas.quick_transaction import (
    QuickTransactionParseRequest,
    QuickTransactionParseResponse,
)

TransactionType = Literal["income", "expense"]

# Minimal rules
INCOME_HINTS = (
    "lương",
    "tiền lương",
    "thưởng",
    "phụ huynh gửi",
    "ba mẹ gửi",
    "bố mẹ gửi",
    "tiền sinh hoạt",
    "thu nhập",
    "tiền thưởng",
)

MONEY_MULTIPLIERS = {
    "k": Decimal("1000"),
    "nghìn": Decimal("1000"),
    "tr": Decimal("1000000"),
    "triệu": Decimal("1000000"),
}


# Regex
_AMOUNT_RE = re.compile(
    r"""
    (?P<raw>
        \d{1,3}(?:[.,]\d{3})+   # 500.000 / 1,234,567
        |
        \d+(?:[.,]\d{1,2})?     # 150 / 5.5 / 1,5
    )
    \s*
    (?P<unit>triệu|tr|nghìn|k)?
    \s*
    (?:đồng|đ)?
    """,
    re.VERBOSE | re.IGNORECASE,
)

_THOUSANDS_RE = re.compile(r"^\d{1,3}(?:[.,]\d{3})+$")

_DATE_RE = re.compile(
    r"(?:ngày\s+)?(?P<day>\d{1,2})/(?P<month>\d{1,2})/(?P<year>\d{4})",
    re.IGNORECASE,
)

# Text helpers
def _normalize_text(value: str) -> str:
    """
    Normalize text để so khớp dễ hơn:
    - lowercase
    - bỏ dấu tiếng Việt
    - gom khoảng trắng
    """
    value = value.lower().strip()
    value = unicodedata.normalize("NFD", value)
    value = "".join(ch for ch in value if unicodedata.category(ch) != "Mn")
    value = re.sub(r"\s+", " ", value)
    return value


def _get_meaningful_words(value: str) -> list[str]:
    """
    Lấy các từ có ý nghĩa từ tên danh mục.
    Ví dụ: "Ăn uống" -> ["an", "uong"]
    """
    normalized = _normalize_text(value)
    return [word for word in normalized.split() if len(word) >= 2]

# Date parsing
def _parse_date(text: str) -> tuple[date, str | None]:
    """
    Parse ngày giao dịch.
    Nếu không thấy ngày rõ ràng thì mặc định là hôm nay.
    """
    today = date.today()

    match = re.search(r"hôm\s*nay", text, re.IGNORECASE)
    if match:
        return today, match.group(0)

    match = re.search(r"hôm\s*qua", text, re.IGNORECASE)
    if match:
        return today - timedelta(days=1), match.group(0)

    match = _DATE_RE.search(text)
    if match:
        try:
            day = int(match.group("day"))
            month = int(match.group("month"))
            year = int(match.group("year"))
            return date(year, month, day), match.group(0)
        except ValueError:
            pass

    return today, None

        
# Amount parsing

def _to_decimal_amount(raw: str, unit: str | None) -> Decimal | None:
    """
    Convert số tiền từ text sang Decimal.

    Ví dụ:
    - 150k      -> 150000
    - 50 nghìn -> 50000
    - 1tr      -> 1000000
    - 1.5tr    -> 1500000
    - 500.000  -> 500000
    """
    unit = (unit or "").lower()

    if _THOUSANDS_RE.match(raw):   
        base = Decimal(raw.replace(".", "").replace(",", ""))
    else:
        base = Decimal(raw.replace(",", "."))

    multiplier = MONEY_MULTIPLIERS.get(unit)
    if multiplier:
        return base * multiplier

    # Không có đơn vị mà số nhỏ quá thì dễ là ngày/tháng, bỏ qua.
    # Ví dụ: ngày 10, tháng 5.
    if base < 1000:
        return None

    return base


def _parse_amount(text: str) -> tuple[Decimal, str] | None:
    """
    Tìm số tiền đầu tiên hợp lệ trong câu nhập.
    """
    for match in _AMOUNT_RE.finditer(text):
        raw = match.group("raw")
        unit = match.group("unit")
        phrase = match.group(0).strip()

        try:
            amount = _to_decimal_amount(raw, unit)
        except Exception:
            continue

        if amount is not None and amount > 0:
            return amount, phrase

    return None


# Type / category helpers
def _parse_type_from_text(text: str) -> TransactionType:
    """
    Nếu không match được category từ DB thì dùng hint tối thiểu để đoán loại.
    Mặc định là expense vì nhập nhanh thường là khoản chi.
    """
    lower = text.lower()

    if any(keyword in lower for keyword in INCOME_HINTS):
        return "income"

    return "expense"


def _get_category_kind(category) -> TransactionType | None:
    """
    category.kind có thể là string hoặc Enum tùy model.
    Hàm này chuẩn hóa về "income" / "expense".
    """
    raw_kind = getattr(category, "kind", None)
    kind = getattr(raw_kind, "value", raw_kind)

    if kind in ("income", "expense"):
        return kind

    return None


def _match_category_from_db(text: str, categories) -> object | None:
    """
    Match category dựa trên danh mục thật của user trong DB.

    Cách match:
    - Ưu tiên nếu nguyên tên danh mục xuất hiện trong câu.
    - Nếu không, thử match từng từ trong tên danh mục.
    """
    normalized_text = _normalize_text(text)

    best_category = None
    best_score = 0

    for category in categories:
        category_name = getattr(category, "name", "")
        normalized_name = _normalize_text(category_name)

        if not normalized_name:
            continue

        score = 0

        # Match nguyên tên danh mục: "ăn uống 150k"
        if normalized_name in normalized_text:
            score = 3
        else:
            # Match từng từ trong tên danh mục: "ăn buffet 150k" -> "Ăn uống"
            words = _get_meaningful_words(category_name)
            if any(word in normalized_text for word in words):
                score = 2

        if score > best_score:
            best_score = score
            best_category = category

    return best_category


# Note builder
def _build_note(text: str, amount_phrase: str, date_phrase: str | None) -> str:
    """
    Tạo ghi chú bằng cách bỏ phần ngày và số tiền ra khỏi câu gốc.
    """
    note = text

    if date_phrase:
        note = note.replace(date_phrase, " ")

    note = note.replace(amount_phrase, " ")

    note = re.sub(
        r"(?:^|(?<=\s))(?:đồng|đ)(?=\s|$)",
        " ",
        note,
        flags=re.IGNORECASE,
    )
    note = re.sub(r"\s+", " ", note).strip(" ,.-:")

    if not note:
        return text.strip().capitalize()

    return note[0].upper() + note[1:]

class QuickTransactionService:
    def __init__(self, db: Session):
        self.category_repo = CategoryRepository(db)

    def _get_user_categories(self, current_user: User):
        """
        Lấy danh mục thật của user từ database.
        """
        return self.category_repo.list_by_user_id(current_user.id)

    def parse_text(
        self,
        current_user: User,
        text: str,
        raise_if_no_amount: bool = True,
    ) -> QuickTransactionParseResponse | None:
        """
        Phân tích câu nhập nhanh thành dữ liệu gợi ý giao dịch.

        Flow:
        1. Parse ngày
        2. Parse số tiền
        3. Match danh mục từ DB của user
        4. Xác định thu / chi
        5. Tạo ghi chú
        6. Trả kết quả cho FE
        """
        text = text.strip()

        if not text:
            if raise_if_no_amount:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Nội dung nhập nhanh không được để trống.",
                )
            return None

        # 1. Parse ngày
        tx_date, date_phrase = _parse_date(text)

        # 2. Parse số tiền
        # Nếu câu có ngày, bỏ cụm ngày ra trước để tránh nhầm số ngày/tháng/năm là số tiền.
        text_for_amount = text.replace(date_phrase, " ") if date_phrase else text
        amount_result = _parse_amount(text_for_amount)

        if amount_result is None:
            if raise_if_no_amount:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Không tìm thấy số tiền trong nội dung nhập nhanh.",
                )
            return None

        amount, amount_phrase = amount_result

        # 3. Match danh mục từ DB của user
        categories = self._get_user_categories(current_user)
        matched_category = _match_category_from_db(text, categories)

        if matched_category:
            category_id = matched_category.id
            suggested_name = matched_category.name
            tx_type = _get_category_kind(matched_category) or _parse_type_from_text(text)
        else:
            category_id = None
            suggested_name = None
            tx_type = _parse_type_from_text(text)

        # 4. Tạo ghi chú
        note = _build_note(text, amount_phrase, date_phrase)

        return QuickTransactionParseResponse(
            type=tx_type,
            amount=amount,
            transaction_date=tx_date,
            note=note,
            suggested_category_name=suggested_name,
            category_id=category_id,
        )

    def parse(
        self,
        current_user: User,
        payload: QuickTransactionParseRequest,
    ) -> QuickTransactionParseResponse:
        result = self.parse_text(
            current_user=current_user,
            text=payload.text,
            raise_if_no_amount=True,
        )

        if result is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Không thể phân tích nội dung nhập nhanh.",
            )

        return result