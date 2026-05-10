from decimal import Decimal
from datetime import date
from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.core.date_range import build_period_range
from app.repositories.statistics_repository import StatisticsRepository
from app.schemas.statistics import (
    CategoryComparisonItem,
    PeriodSummary,
    StatisticsCompareResponse,
    StatisticsDifference,
)


def _safe_percent(diff: Decimal, compare_value: Decimal) -> Optional[float]:
    """Percent change = diff / compare_value * 100.
    Returns None when compare_value is 0 (no prior data).
    """
    if compare_value == 0:
        return None
    return round(float(diff / compare_value * 100), 2)


class StatisticsService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = StatisticsRepository(db)

    def compare_months(
        self,
        user_id: UUID,
        current_month: int,
        current_year: int,
        compare_month: int,
        compare_year: int,
    ) -> StatisticsCompareResponse:
        # Build exclusive date ranges
        curr_start, curr_end = build_period_range(
            "month", month=current_month, year=current_year
        )
        cmp_start, cmp_end = build_period_range(
            "month", month=compare_month, year=compare_year
        )

        # Fetch summaries from DB
        curr_data = self.repo.get_period_summary(user_id, curr_start, curr_end)
        cmp_data = self.repo.get_period_summary(user_id, cmp_start, cmp_end)

        current = PeriodSummary(
            label=f"Tháng {current_month}/{current_year}",
            **curr_data,
        )
        compare = PeriodSummary(
            label=f"Tháng {compare_month}/{compare_year}",
            **cmp_data,
        )

        # Differences (current - compare)
        income_diff = current.total_income - compare.total_income
        expense_diff = current.total_expense - compare.total_expense
        balance_diff = current.period_balance - compare.period_balance

        difference = StatisticsDifference(
            income_diff=income_diff,
            expense_diff=expense_diff,
            balance_diff=balance_diff,
            income_percent=_safe_percent(income_diff, compare.total_income),
            expense_percent=_safe_percent(expense_diff, compare.total_expense),
            balance_percent=_safe_percent(balance_diff, compare.period_balance),
        )

        # Category comparison — merge both periods
        curr_cats = {
            str(row.id): row
            for row in self.repo.get_expense_by_category(user_id, curr_start, curr_end)
        }
        cmp_cats = {
            str(row.id): row
            for row in self.repo.get_expense_by_category(user_id, cmp_start, cmp_end)
        }

        all_cat_ids = set(curr_cats.keys()) | set(cmp_cats.keys())
        category_comparison: list[CategoryComparisonItem] = []

        for cat_id in all_cat_ids:
            curr_row = curr_cats.get(cat_id)
            cmp_row = cmp_cats.get(cat_id)
            current_total = Decimal(str(curr_row.total)) if curr_row else Decimal("0")
            compare_total = Decimal(str(cmp_row.total)) if cmp_row else Decimal("0")
            diff = current_total - compare_total
            cat_name = (curr_row or cmp_row).name  # type: ignore[union-attr]

            category_comparison.append(
                CategoryComparisonItem(
                    category_id=cat_id,
                    category_name=cat_name,
                    current_total=current_total,
                    compare_total=compare_total,
                    diff=diff,
                    percent=_safe_percent(diff, compare_total),
                )
            )

        # Sort by current_total descending so biggest spenders appear first
        category_comparison.sort(key=lambda x: x.current_total, reverse=True)

        return StatisticsCompareResponse(
            period="month",
            current=current,
            compare=compare,
            difference=difference,
            category_comparison=category_comparison,
        )

    # ------------------------------------------------------------------
    # Methods for Dashboard (exclusive end_date from build_period_range)
    # ------------------------------------------------------------------

    def get_period_summary(
        self, user_id: UUID, start_date: date, end_date: date
    ) -> dict:
        """Exclusive end_date. Returns {total_income, total_expense, period_balance}."""
        return self.repo.get_period_summary(user_id, start_date, end_date)

    def get_expense_by_category_for_period(
        self, user_id: UUID, start_date: date, end_date: date
    ) -> list[dict]:
        """Exclusive end_date. Returns [{category_id, category_name, total}]."""
        rows = self.repo.get_expense_by_category(user_id, start_date, end_date)
        return self._map_category_rows(rows)

    # ------------------------------------------------------------------
    # Methods for AssistantService (inclusive optional date_from/date_to)
    # ------------------------------------------------------------------

    def get_summary(
        self,
        user_id: UUID,
        date_from: date | None = None,
        date_to: date | None = None,
    ) -> dict:
        """Inclusive optional dates. Returns {total_income, total_expense, balance}."""
        return self.repo.get_summary(user_id, date_from=date_from, date_to=date_to)

    def get_total_by_category(
        self,
        user_id: UUID,
        tx_type: str,
        date_from: date | None = None,
        date_to: date | None = None,
    ):
        """Inclusive optional dates. Returns raw rows with .name and .total attributes."""
        return self.repo.get_total_by_category(
            user_id, tx_type, date_from=date_from, date_to=date_to
        )

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _map_category_rows(rows) -> list[dict]:
        return [
            {
                "category_id": str(row.id),
                "category_name": row.name,
                "total": row.total,
            }
            for row in rows
        ]
