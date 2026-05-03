from datetime import date

from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.dashboard import DashboardOverviewResponse
from app.services.budget_service import BudgetService
from app.services.report_service import ReportService
from app.services.transaction_service import TransactionService
from app.core.date_range import resolve_date_range


class DashboardService:
    def __init__(self, db: Session):
        self.db = db
        self.report_service = ReportService(db)
        self.budget_service = BudgetService(db)
        self.transaction_service = TransactionService(db)

    def get_overview(
        self,
        current_user: User,
        date_from: date | None = None,
        date_to: date | None = None,
        preset: str | None = None,
    ) -> DashboardOverviewResponse:
        resolved_from, resolved_to = resolve_date_range(date_from, date_to, preset)
    

        # 1) Overview of income / expenses / balance for the month
        summary = self.report_service.get_summary(
            current_user=current_user,
            date_from=resolved_from,
            date_to=resolved_to,
        )

        # 2) Expense by category for the month
        expense_by_category = self.report_service.get_expense_by_category(
            current_user=current_user,
            date_from=resolved_from,
            date_to=resolved_to,
        )

        # 3) Budget progress for the month
        budget_progress = []
        if resolved_from.year == resolved_to.year and resolved_from.month == resolved_to.month:
            budget_progress = self.budget_service.get_budget_progress(
                current_user=current_user,
                year=resolved_from.year,
                month=resolved_from.month,
            )

        # 4) 5 most recent transactions in the month
        recent_transactions_page = self.transaction_service.list_my_transactions(
            current_user=current_user,
            date_from=resolved_from,
            date_to=resolved_to,
            tx_type=None,
            limit=5,
            offset=0,
            sort_by="transaction_date",
            sort_order="desc",
        )
        
        return DashboardOverviewResponse(
            summary=summary,
            expense_by_category=expense_by_category,
            budget_progress=budget_progress,
            recent_transactions=recent_transactions_page.items,
        )