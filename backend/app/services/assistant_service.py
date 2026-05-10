import calendar
import re
from datetime import date, timedelta
from decimal import Decimal
import unicodedata

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.user import User
from app.repositories.report_repository import ReportRepository
from app.repositories.transaction_repository import TransactionRepository


class AssistantService:
    def __init__(self, db: Session):
        self.db = db
        self.report_repo = ReportRepository(db)
        self.transaction_repo = TransactionRepository(db)

    def chat(self, current_user: User, message: str) -> dict:
        normalized = self._normalize(message)
        date_from, date_to, period_label = self._detect_period(normalized)
        gemini_response = self._gemini_reply(
            current_user=current_user,
            message=message,
            normalized_message=normalized,
            date_from=date_from,
            date_to=date_to,
            period_label=period_label,
        )

        if gemini_response is not None:
            return gemini_response

        if self._is_recent_transactions_question(normalized):
            return self._recent_transactions_reply(current_user, date_from, date_to, period_label)

        if self._is_category_question(normalized):
            return self._expense_by_category_reply(current_user, date_from, date_to, period_label)

        if self._is_saving_question(normalized):
            return self._saving_advice_reply(current_user, date_from, date_to, period_label)

        if self._is_summary_question(normalized):
            return self._summary_reply(current_user, date_from, date_to, period_label)

        return {
            "reply": (
                "Mình có thể hỗ trợ xem tổng thu chi, danh mục chi tiêu cao nhất, "
                "giao dịch gần đây hoặc gợi ý tiết kiệm dựa trên dữ liệu của bạn."
            ),
            "intent": "help",
            "suggestions": self._default_suggestions(),
        }

    def _gemini_reply(
        self,
        current_user: User,
        message: str,
        normalized_message: str,
        date_from: date | None,
        date_to: date | None,
        period_label: str,
    ) -> dict | None:
        print("AI provider:", settings.ai_provider)
        print("Has Gemini key:", bool(settings.gemini_api_key))
        if settings.ai_provider.lower() != "gemini" or not settings.gemini_api_key:
            print("Gemini skipped: using local fallback")
            return None
        print("Gemini enabled: calling Gemini API")
        try:
            from app.services.gemini_service import GeminiService

            finance_context = self._build_finance_context(
                current_user=current_user,
                date_from=date_from,
                date_to=date_to,
                period_label=period_label,
            )
            reply = GeminiService().generate_finance_reply(
                user_message=message,
                finance_context=finance_context,
            )
        except Exception:
            return None

        return {
            "reply": reply,
            "intent": self._detect_intent(normalized_message),
            "suggestions": self._default_suggestions(),
        }

    def _build_finance_context(
        self,
        current_user: User,
        date_from: date | None,
        date_to: date | None,
        period_label: str,
    ) -> str:
        summary = self.report_repo.get_summary(
            current_user.id,
            date_from=date_from,
            date_to=date_to,
        )
        expense_rows = self.report_repo.get_total_by_category(
            current_user.id,
            tx_type="expense",
            date_from=date_from,
            date_to=date_to,
        )
        income_rows = self.report_repo.get_total_by_category(
            current_user.id,
            tx_type="income",
            date_from=date_from,
            date_to=date_to,
        )

        expense_lines = self._format_category_context(expense_rows)
        income_lines = self._format_category_context(income_rows)
        recent_lines = self._recent_transactions_context(
            current_user=current_user,
            date_from=date_from,
            date_to=date_to,
        )

        return f"""
Kỳ dữ liệu: {period_label}
Từ ngày: {date_from or "không giới hạn"}
Đến ngày: {date_to or "không giới hạn"}
Tổng thu: {self._format_money(summary["total_income"])}
Tổng chi: {self._format_money(summary["total_expense"])}
Số dư: {self._format_money(summary["balance"])}

Thu nhập theo danh mục:
{income_lines}

Chi tiêu theo danh mục:
{expense_lines}

Giao dịch gần đây:
{recent_lines}
""".strip()

    def _format_category_context(self, rows) -> str:
        if not rows:
            return "Chưa có dữ liệu."

        return "\n".join(
            f"- {row.name}: {self._format_money(row.total)}"
            for row in rows[:10]
        )

    def _recent_transactions_context(
        self,
        current_user: User,
        date_from: date | None,
        date_to: date | None,
    ) -> str:
        rows = self.transaction_repo.get_recent_with_category(
            user_id=current_user.id,
            date_from=date_from,
            date_to=date_to,
            limit=5,
        )

        if not rows:
            return "Chưa có giao dịch."

        lines = []
        for transaction, category_name in rows:
            sign = "+" if transaction.type == "income" else "-"
            note = f" - {transaction.note}" if transaction.note else ""
            lines.append(
                f"- {transaction.transaction_date.strftime('%d/%m/%Y')}: "
                f"{sign}{self._format_money(transaction.amount)} "
                f"({category_name}){note}"
            )

        return "\n".join(lines)

    def _summary_reply(
        self,
        current_user: User,
        date_from: date | None,
        date_to: date | None,
        period_label: str,
    ) -> dict:
        summary = self.report_repo.get_summary(
            current_user.id,
            date_from=date_from,
            date_to=date_to,
        )
        income = summary["total_income"]
        expense = summary["total_expense"]
        balance = summary["balance"]
        status_text = "dư" if balance >= 0 else "âm"

        return {
            "reply": (
                f"{period_label}, tổng thu là {self._format_money(income)}, "
                f"tổng chi là {self._format_money(expense)}. "
                f"Số dư đang {status_text} {self._format_money(abs(balance))}."
            ),
            "intent": "summary",
            "suggestions": [
                "Danh mục nào tốn tiền nhất?",
                "Giao dịch gần đây",
                "Gợi ý tiết kiệm cho tôi",
            ],
        }

    def _expense_by_category_reply(
        self,
        current_user: User,
        date_from: date | None,
        date_to: date | None,
        period_label: str,
    ) -> dict:
        rows = self.report_repo.get_total_by_category(
            current_user.id,
            tx_type="expense",
            date_from=date_from,
            date_to=date_to,
        )
        if not rows:
            return {
                "reply": f"{period_label}, chưa có khoản chi nào theo danh mục.",
                "intent": "expense_by_category",
                "suggestions": self._default_suggestions(),
            }

        total = sum((row.total for row in rows), Decimal("0"))
        lines = []
        for index, row in enumerate(rows[:5], start=1):
            percent = (row.total / total * Decimal("100")) if total else Decimal("0")
            lines.append(
                f"{index}. {row.name}: {self._format_money(row.total)} ({percent:.0f}%)"
            )

        return {
            "reply": f"{period_label}, chi tiêu theo danh mục cao nhất:\n" + "\n".join(lines),
            "intent": "expense_by_category",
            "suggestions": [
                "Tổng thu chi tháng này",
                "Giao dịch gần đây",
                "Gợi ý tiết kiệm cho tôi",
            ],
        }

    def _recent_transactions_reply(
        self,
        current_user: User,
        date_from: date | None,
        date_to: date | None,
        period_label: str,
    ) -> dict:
        rows = self.transaction_repo.get_recent_with_category(
            user_id=current_user.id,
            date_from=date_from,
            date_to=date_to,
            limit=5,
        )

        if not rows:
            return {
                "reply": f"{period_label}, chưa có giao dịch nào.",
                "intent": "recent_transactions",
                "suggestions": self._default_suggestions(),
            }

        lines = []
        for transaction, category_name in rows:
            sign = "+" if transaction.type == "income" else "-"
            note = f" - {transaction.note}" if transaction.note else ""
            lines.append(
                f"{transaction.transaction_date.strftime('%d/%m/%Y')}: "
                f"{sign}{self._format_money(transaction.amount)} "
                f"({category_name}){note}"
            )

        return {
            "reply": f"{period_label}, 5 giao dịch gần đây:\n" + "\n".join(lines),
            "intent": "recent_transactions",
            "suggestions": [
                "Tổng thu chi tháng này",
                "Danh mục nào tốn tiền nhất?",
                "Gợi ý tiết kiệm cho tôi",
            ],
        }

    def _saving_advice_reply(
        self,
        current_user: User,
        date_from: date | None,
        date_to: date | None,
        period_label: str,
    ) -> dict:
        summary = self.report_repo.get_summary(
            current_user.id,
            date_from=date_from,
            date_to=date_to,
        )
        rows = self.report_repo.get_total_by_category(
            current_user.id,
            tx_type="expense",
            date_from=date_from,
            date_to=date_to,
        )

        income = summary["total_income"]
        expense = summary["total_expense"]
        balance = summary["balance"]

        if expense <= 0:
            advice = "Bạn chưa có dữ liệu chi tiêu để phân tích. Hãy thêm giao dịch trước."
        elif rows:
            top = rows[0]
            advice = (
                f"Khoản chi lớn nhất là {top.name} với {self._format_money(top.total)}. "
                "Bạn nên đặt giới hạn cho danh mục này trước, vì đây là nơi dễ tạo tác động nhất."
            )
        else:
            advice = "Bạn nên bắt đầu bằng việc phân loại giao dịch để thấy nhóm chi tiêu lớn nhất."

        if income > 0 and balance < 0:
            advice += (
                f" Hiện chi tiêu đang cao hơn thu nhập {self._format_money(abs(balance))}, "
                "nên ưu tiên giảm các khoản không thiết yếu."
            )

        return {
            "reply": (
                f"{period_label}, thu nhập là {self._format_money(income)} và "
                f"chi tiêu là {self._format_money(expense)}. {advice}"
            ),
            "intent": "saving_advice",
            "suggestions": [
                "Danh mục nào tốn tiền nhất?",
                "Giao dịch gần đây",
                "Tổng thu chi tháng này",
            ],
        }

    def _detect_period(
        self,
        normalized_message: str,
        _today: date | None = None,
    ) -> tuple[date | None, date | None, str]:
        today = _today or date.today()

        # 1. Tất cả dữ liệu — không lọc ngày
        if "tat ca" in normalized_message or "toan bo" in normalized_message:
            return None, None, "Tất cả dữ liệu"

        # 2. Hôm nay
        if "hom nay" in normalized_message:
            return today, today, "Hôm nay"

        # 3. Tuần này
        if "tuan" in normalized_message:
            start = today - timedelta(days=today.weekday())
            return start, today, "Tuần này"

        # 4. Tháng cụ thể: "tháng 6", "tháng 6/2026", "tháng 6 năm 2026"
        # Phải kiểm tra TRƯỚC "năm" để tránh "tháng 6 năm 2026" bị parse thành cả năm
        month_match = re.search(
            r"thang\s+(\d{1,2})(?:\s*(?:/\s*|nam\s+)(\d{4}))?",
            normalized_message,
        )
        if month_match:
            month = int(month_match.group(1))
            year_str = month_match.group(2)
            year = int(year_str) if year_str else today.year
            if 1 <= month <= 12:
                _, last_day = calendar.monthrange(year, month)
                return (
                    date(year, month, 1),
                    date(year, month, last_day),
                    f"Tháng {month}/{year}",
                )
            # Tháng không hợp lệ (0 hoặc 13+): fallback tháng hiện tại
            _, last_day = calendar.monthrange(today.year, today.month)
            return (
                date(today.year, today.month, 1),
                date(today.year, today.month, last_day),
                f"Tháng {today.month}/{today.year}",
            )

        # 5. Tháng trước
        if "thang truoc" in normalized_message:
            first_this_month = date(today.year, today.month, 1)
            last_month_last = first_this_month - timedelta(days=1)
            last_month_first = date(last_month_last.year, last_month_last.month, 1)
            return (
                last_month_first,
                last_month_last,
                f"Tháng {last_month_last.month}/{last_month_last.year}",
            )

        # 6. Tháng này (hoặc bất kỳ "tháng" nào không khớp ở trên)
        if "thang" in normalized_message:
            _, last_day = calendar.monthrange(today.year, today.month)
            return (
                date(today.year, today.month, 1),
                date(today.year, today.month, last_day),
                f"Tháng {today.month}/{today.year}",
            )

        # 7. Năm cụ thể: "năm 2026"
        year_match = re.search(r"\bnam\s+(\d{4})\b", normalized_message)
        if year_match:
            year = int(year_match.group(1))
            return date(year, 1, 1), date(year, 12, 31), f"Năm {year}"

        # 8. Năm nay (hoặc bất kỳ "năm" nào không khớp ở trên)
        if "nam" in normalized_message:
            return (
                date(today.year, 1, 1),
                date(today.year, 12, 31),
                f"Năm {today.year}",
            )

        # 9. Fallback: tháng hiện tại
        _, last_day = calendar.monthrange(today.year, today.month)
        return (
            date(today.year, today.month, 1),
            date(today.year, today.month, last_day),
            f"Tháng {today.month}/{today.year}",
        )

    def _is_summary_question(self, normalized_message: str) -> bool:
        keywords = [
            "tong thu chi",
            "thu chi",
            "so du",
            "thong ke",
            "bao nhieu",
            "tong thu",
            "tong chi",
        ]
        return any(keyword in normalized_message for keyword in keywords)

    def _detect_intent(self, normalized_message: str) -> str:
        if self._is_recent_transactions_question(normalized_message):
            return "recent_transactions"

        if self._is_category_question(normalized_message):
            return "expense_by_category"

        if self._is_saving_question(normalized_message):
            return "saving_advice"

        if self._is_summary_question(normalized_message):
            return "summary"

        return "help"

    def _is_category_question(self, normalized_message: str) -> bool:
        keywords = [
            "danh muc",
            "muc nao",
            "ton tien",
            "chi nhieu",
            "cao nhat",
            "theo loai",
        ]
        return any(keyword in normalized_message for keyword in keywords)

    def _is_recent_transactions_question(self, normalized_message: str) -> bool:
        keywords = ["giao dich", "gan day", "lich su", "moi nhat"]
        return any(keyword in normalized_message for keyword in keywords)

    def _is_saving_question(self, normalized_message: str) -> bool:
        keywords = ["tiet kiem", "goi y", "tu van", "giam chi", "canh bao"]
        return any(keyword in normalized_message for keyword in keywords)

    def _default_suggestions(self) -> list[str]:
        return [
            "Tổng thu chi tháng này",
            "Danh mục nào tốn tiền nhất?",
            "Giao dịch gần đây",
            "Gợi ý tiết kiệm cho tôi",
        ]

    def _format_money(self, value: Decimal) -> str:
        return f"{value:,.0f}".replace(",", ".") + " đ"

    def _normalize(self, value: str) -> str:
        normalized = unicodedata.normalize("NFD", value.lower())
        without_accents = "".join(
            char for char in normalized if unicodedata.category(char) != "Mn"
        )
        return without_accents.replace("đ", "d")
