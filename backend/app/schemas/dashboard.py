from decimal import Decimal

from pydantic import BaseModel

from app.schemas.budget import BudgetProgressItem
from app.schemas.report import CategoryBreakdownItem
from app.schemas.transaction import TransactionResponse


class DashboardSummaryResponse(BaseModel):
    current_balance: Decimal
    period_balance: Decimal
    total_income: Decimal
    total_expense: Decimal


class DashboardOverviewResponse(BaseModel):
    summary: DashboardSummaryResponse
    expense_by_category: list[CategoryBreakdownItem]
    budget_progress: list[BudgetProgressItem]
    recent_transactions: list[TransactionResponse]