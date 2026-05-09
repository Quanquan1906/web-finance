from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class PeriodSummary(BaseModel):
    label: str
    total_income: Decimal
    total_expense: Decimal
    period_balance: Decimal


class StatisticsDifference(BaseModel):
    income_diff: Decimal
    expense_diff: Decimal
    balance_diff: Decimal
    income_percent: Optional[float]
    expense_percent: Optional[float]
    balance_percent: Optional[float]


class CategoryComparisonItem(BaseModel):
    category_id: str
    category_name: str
    current_total: Decimal
    compare_total: Decimal
    diff: Decimal
    percent: Optional[float]


class StatisticsCompareResponse(BaseModel):
    period: str
    current: PeriodSummary
    compare: PeriodSummary
    difference: StatisticsDifference
    category_comparison: list[CategoryComparisonItem]
