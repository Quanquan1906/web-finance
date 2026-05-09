from datetime import date
from decimal import Decimal
from typing import Literal

from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.dashboard import DashboardOverviewResponse, DashboardSummaryResponse
from app.services.budget_service import BudgetService
from app.services.report_service import ReportService
from app.services.transaction_service import TransactionService
from app.core.date_range import build_period_range


class DashboardService:
    def __init__(self, db: Session):
        self.db = db
        self.report_service = ReportService(db)
        self.budget_service = BudgetService(db)
        self.transaction_service = TransactionService(db)

    def get_overview(
        self,
        current_user: User,
        period: Literal["day", "month", "year"],
        date: date | None = None,
        month: int | None = None,
        year: int | None = None,
    ) -> DashboardOverviewResponse:
        start_date, end_date = build_period_range(
            period=period,
            date=date,
            month=month,
            year=year,
        )

        # 1) All-time balance (not affected by period filter)
        current_balance = self.report_service.get_current_balance(current_user)

        # 2) Period income / expense
        period_data = self.report_service.get_summary(
            current_user=current_user,
            date_from=start_date,
            date_to=end_date,
        )
        total_income = period_data["total_income"]
        total_expense = period_data["total_expense"]

        summary = DashboardSummaryResponse(
            current_balance=current_balance,
            period_balance=total_income - total_expense,
            total_income=total_income,
            total_expense=total_expense,
        )

        # 3) Expense by category in period
        expense_by_category = self.report_service.get_expense_by_category(
            current_user=current_user,
            date_from=start_date,
            date_to=end_date,
        )

        # 4) Budget progress — only relevant for month view
        budget_progress = []
        if period == "month":
            budget_progress = self.budget_service.get_budget_progress(
                current_user=current_user,
                year=start_date.year,
                month=start_date.month,
            )

        # 5) 5 most recent transactions in the period
        recent_transactions_page = self.transaction_service.list_my_transactions(
            current_user=current_user,
            date_from=start_date,
            date_to=end_date,
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