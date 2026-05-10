from decimal import Decimal

from pydantic import BaseModel

from app.schemas.budget import BudgetProgressItem
from app.schemas.transaction import TransactionResponse


class CategoryBreakdownItem(BaseModel):
    category_id: str
    category_name: str
    total: Decimal


class DashboardSummaryResponse(BaseModel):
    total_income: Decimal
    total_expense: Decimal
    period_balance: Decimal


class DashboardOverviewResponse(BaseModel):
    summary: DashboardSummaryResponse
    expense_by_category: list[CategoryBreakdownItem]
    budget_progress: list[BudgetProgressItem]
    recent_transactions: list[TransactionResponse]