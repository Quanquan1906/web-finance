import re
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

# ---------------------------------------------------------------------------
# Keyword maps
# ---------------------------------------------------------------------------

INCOME_KEYWORDS = [
    "lương",
    "tiền lương",
    "thưởng",
    "phụ huynh gửi",
    "ba mẹ gửi",
    "bố mẹ gửi",
    "tiền sinh hoạt",
    "thu nhập",
    "tiền thưởng",
]

# Each entry: (list[keyword], category_name, kind)
CATEGORY_RULES: list[tuple[list[str], str, Literal["income", "expense"]]] = [
    (["ăn", "uống", "buffet", "cà phê", "cafe", "phở", "cơm", "bún", "hủ tiếu", "quán", "nhà hàng", "trà sữa"], "Ăn uống", "expense"),
    (["xăng", "xe", "grab", "bus", "taxi", "gửi xe", "đi lại", "xăng xe", "giao thông"], "Di chuyển", "expense"),
    (["sách", "tài liệu", "học", "khóa học", "học phí"], "Học tập", "expense"),
    (["phim", "game", "sinh nhật", "chơi", "giải trí", "du lịch", "concert"], "Giải trí", "expense"),
    (["áo", "quần", "giày", "dép", "mua sắm", "quần áo", "túi", "shop"], "Mua sắm", "expense"),
    (["thuốc", "bác sĩ", "bệnh viện", "khám", "y tế", "sức khỏe"], "Sức khỏe", "expense"),
    (["điện", "nước", "internet", "điện thoại", "hoá đơn", "hóa đơn"], "Hóa đơn", "expense"),
    (["lương", "tiền lương"], "Lương", "income"),
    (["thưởng", "tiền thưởng"], "Thưởng", "income"),
    (["tiền sinh hoạt", "phụ huynh", "ba mẹ", "bố mẹ", "sinh hoạt phí"], "Tiền sinh hoạt", "income"),
    (["thu nhập"], "Thu nhập khác", "income"),
]

# ---------------------------------------------------------------------------
# Amount parsing
# ---------------------------------------------------------------------------

# Matches:
#   thousands:   500.000 / 1.234.567 / 1,234,567
#   decimal:     5.5 / 1,5 / 5,50
#   plain int:   500000 / 50
# Followed by optional unit (k / nghìn / tr / triệu) and optional currency suffix (đồng / đ)
_AMOUNT_RE = re.compile(
    r"""
    (?P<value>
        \d{1,3}(?:[.,]\d{3})+   # thousands format:  500.000 / 1,234,567
        | \d+[.,]\d{1,2}        # decimal format:    5.5 / 1,5
        | \d+                   # plain integer:     500000 / 50
    )
    \s*
    (?P<unit>triệu|tr|nghìn|k)?
    \s*
    (?:đồng|đ)?
    """,
    re.VERBOSE | re.IGNORECASE,
)

_THOUSANDS_RE = re.compile(r"^\d{1,3}(?:[.,]\d{3})+$")
_DECIMAL_FMT_RE = re.compile(r"^\d+[.,]\d{1,2}$")


def _normalize_value(raw: str) -> Decimal:
    """Convert a raw number string to Decimal, handling thousand-sep vs decimal-sep."""
    if _THOUSANDS_RE.match(raw):
        # e.g. 500.000 or 1,234,567 → remove all separators
        return Decimal(raw.replace(".", "").replace(",", ""))
    if _DECIMAL_FMT_RE.match(raw):
        # e.g. 5.5 or 1,5 → normalise decimal separator to "."
        return Decimal(raw.replace(",", "."))
    return Decimal(raw)


def _parse_amount(text: str) -> tuple[Decimal, str] | None:
    """
    Find the best amount token in *text* (which should already have the date
    phrase stripped to avoid matching day/year digits).

    Returns (normalized_amount, matched_phrase) where matched_phrase is the
    full original substring including any trailing unit / currency word.
    Returns None if no valid amount is found.
    """
    best_priority = -1
    best_value: Decimal | None = None
    best_phrase: str | None = None

    for m in _AMOUNT_RE.finditer(text):
        raw = m.group("value")
        unit = (m.group("unit") or "").lower()

        try:
            base = _normalize_value(raw)
        except Exception:
            continue

        if base <= 0:
            continue

        if unit in ("k", "nghìn"):
            value = base * Decimal("1000")
        elif unit in ("tr", "triệu"):
            value = base * Decimal("1000000")
        else:
            value = base

        # Priority: explicit unit > formatted number > plain int ≥3 digits > tiny int
        has_unit = bool(unit)
        is_formatted = bool(_THOUSANDS_RE.match(raw) or _DECIMAL_FMT_RE.match(raw))
        digit_count = len(raw.replace(".", "").replace(",", ""))

        if has_unit:
            priority = 3
        elif is_formatted:
            priority = 2
        elif digit_count >= 3:
            priority = 1
        else:
            priority = 0  # 1-2 digit plain int (likely a date digit)

        # Strip trailing whitespace from phrase so we don't over-consume spaces
        phrase = m.group(0).rstrip()

        if priority > best_priority or (
            priority == best_priority and best_value is not None and value > best_value
        ):
            best_priority = priority
            best_value = value
            best_phrase = phrase

    if best_value is None or best_phrase is None:
        return None
    return best_value, best_phrase


# ---------------------------------------------------------------------------
# Date parsing
# ---------------------------------------------------------------------------

def _parse_date(text: str) -> tuple[date, str | None]:
    """Return (parsed_date, matched_phrase | None). Defaults to today."""
    today = date.today()

    m = re.search(r"hôm\s*nay", text, re.IGNORECASE)
    if m:
        return today, m.group(0)

    m = re.search(r"hôm\s*qua", text, re.IGNORECASE)
    if m:
        return today - timedelta(days=1), m.group(0)

    # "ngày D/M/YYYY" or bare "D/M/YYYY"  (Vietnamese: day/month/year)
    m = re.search(r"(?:ngày\s+)?(\d{1,2})/(\d{1,2})/(\d{4})", text, re.IGNORECASE)
    if m:
        try:
            d = int(m.group(1))
            month = int(m.group(2))
            y = int(m.group(3))
            return date(y, month, d), m.group(0)
        except ValueError:
            pass

    return today, None


# ---------------------------------------------------------------------------
# Type / category helpers
# ---------------------------------------------------------------------------

def _parse_type(text: str) -> Literal["income", "expense"]:
    lower = text.lower()
    for keyword in INCOME_KEYWORDS:
        if keyword in lower:
            return "income"
    return "expense"


def _suggest_category(text: str, tx_type: Literal["income", "expense"]) -> str | None:
    lower = text.lower()
    for keywords, category_name, kind in CATEGORY_RULES:
        if kind != tx_type:
            continue
        for kw in keywords:
            if kw in lower:
                return category_name
    return None


# ---------------------------------------------------------------------------
# Note builder
# ---------------------------------------------------------------------------

def _build_note(text: str, amount_phrase: str, date_phrase: str | None) -> str:
    """
    Remove the amount phrase and date phrase from *text*, then clean up the
    remainder into a tidy note string.
    """
    note = text

    # Remove date phrase first so its digits don't interfere with amount removal
    if date_phrase:
        note = note.replace(date_phrase, " ")

    # Remove the full amount phrase (includes unit/currency word)
    note = note.replace(amount_phrase, " ")

    # Remove any residual standalone currency words left by edge cases
    note = re.sub(r"(?:^|(?<=\s))(?:đồng|đ)(?=\s|$)", " ", note, flags=re.IGNORECASE)

    # Collapse multiple spaces and strip surrounding punctuation
    note = re.sub(r"\s{2,}", " ", note).strip(" ,.-:")

    if note:
        note = note[0].upper() + note[1:]

    return note or text.strip().capitalize()


# ---------------------------------------------------------------------------
# Service
# ---------------------------------------------------------------------------

class QuickTransactionService:
    def __init__(self, db: Session):
        self.category_repo = CategoryRepository(db)

    def parse_text(
        self,
        current_user: User,
        text: str,
        raise_if_no_amount: bool = True,
    ) -> QuickTransactionParseResponse | None:
        """
        Core parsing logic. Accepts plain text and returns a suggestion.
        If raise_if_no_amount=True, raises HTTP 400 when no amount is found.
        If raise_if_no_amount=False, returns None instead (used by OCR flow).
        """
        text = text.strip()

        # --- Date (parse first so we can exclude date digits from amount search) ---
        tx_date, date_phrase = _parse_date(text)

        # Strip the date phrase before looking for the amount to prevent
        # date digits (9, 5, 2026) from being mistaken for a monetary amount.
        text_for_amount = text.replace(date_phrase, " ") if date_phrase else text

        # --- Amount ---
        amount_result = _parse_amount(text_for_amount)
        if amount_result is None:
            if raise_if_no_amount:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Không tìm thấy số tiền trong nội dung nhập nhanh.",
                )
            return None
        amount, amount_phrase = amount_result

        # --- Type ---
        tx_type = _parse_type(text)

        # --- Category suggestion ---
        suggested_name = _suggest_category(text, tx_type)

        # --- Try to resolve category_id ---
        category_id: UUID | None = None
        if suggested_name:
            category = self.category_repo.get_by_name_for_user(
                user_id=current_user.id,
                name=suggested_name,
                kind=tx_type,
            )
            if category:
                category_id = category.id

        # --- Note ---
        note = _build_note(text, amount_phrase, date_phrase)

        # Simple confidence heuristic
        confidence = 0.5
        if category_id:
            confidence += 0.2
        if date_phrase:
            confidence += 0.15
        if tx_type == "income" and any(kw in text.lower() for kw in INCOME_KEYWORDS):
            confidence += 0.15

        return QuickTransactionParseResponse(
            type=tx_type,
            amount=amount,
            transaction_date=tx_date,
            note=note,
            suggested_category_name=suggested_name,
            category_id=category_id,
            confidence=round(min(confidence, 1.0), 2),
        )

    def parse(
        self,
        current_user: User,
        payload: QuickTransactionParseRequest,
    ) -> QuickTransactionParseResponse:
        return self.parse_text(current_user, payload.text, raise_if_no_amount=True)  # type: ignore[return-value]
