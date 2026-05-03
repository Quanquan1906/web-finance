from pydantic import BaseModel

from app.schemas.budget import BudgetProgressItem
from app.schemas.report import CategoryBreakdownItem, ReportSummaryResponse
from app.schemas.transaction import TransactionResponse


class DashboardOverviewResponse(BaseModel):
    summary: ReportSummaryResponse
    expense_by_category: list[CategoryBreakdownItem]
    budget_progress: list[BudgetProgressItem]
    recent_transactions: list[TransactionResponse]