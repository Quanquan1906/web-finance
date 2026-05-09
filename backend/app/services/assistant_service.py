from datetime import date, timedelta
from decimal import Decimal
import unicodedata

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.user import User
from app.repositories.report_repository import ReportRepository


class AssistantService:
    def __init__(self, db: Session):
        self.db = db
        self.report_repo = ReportRepository(db)

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
        if settings.ai_provider.lower() != "gemini" or not settings.gemini_api_key:
            return None

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
        stmt = (
            select(Transaction, Category.name.label("category_name"))
            .join(Category, Category.id == Transaction.category_id)
            .where(Transaction.user_id == current_user.id)
        )

        if date_from is not None:
            stmt = stmt.where(Transaction.transaction_date >= date_from)

        if date_to is not None:
            stmt = stmt.where(Transaction.transaction_date <= date_to)

        stmt = stmt.order_by(
            Transaction.transaction_date.desc(),
            Transaction.created_at.desc(),
        ).limit(5)
        rows = self.db.execute(stmt).all()

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
        stmt = (
            select(Transaction, Category.name.label("category_name"))
            .join(Category, Category.id == Transaction.category_id)
            .where(Transaction.user_id == current_user.id)
        )

        if date_from is not None:
            stmt = stmt.where(Transaction.transaction_date >= date_from)

        if date_to is not None:
            stmt = stmt.where(Transaction.transaction_date <= date_to)

        stmt = stmt.order_by(Transaction.transaction_date.desc(), Transaction.created_at.desc()).limit(5)
        rows = self.db.execute(stmt).all()

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

    def _detect_period(self, normalized_message: str) -> tuple[date | None, date | None, str]:
        today = date.today()

        if "hom nay" in normalized_message:
            return today, today, "Hôm nay"

        if "tuan" in normalized_message:
            start = today - timedelta(days=today.weekday())
            return start, today, "Tuần này"

        if "nam" in normalized_message:
            return date(today.year, 1, 1), today, "Năm nay"

        if "tat ca" in normalized_message or "toan bo" in normalized_message:
            return None, None, "Tất cả dữ liệu"

        start = date(today.year, today.month, 1)
        return start, today, "Tháng này"

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
