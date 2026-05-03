from decimal import Decimal

from pydantic import BaseModel


class ReportSummaryResponse(BaseModel):
    total_income: Decimal
    total_expense: Decimal
    balance: Decimal


class CategoryBreakdownItem(BaseModel):
    category_id: str
    category_name: str
    total: Decimal