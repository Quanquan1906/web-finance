from datetime import date
from decimal import Decimal
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.transaction import Transaction

class StatisticsRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_period_summary(
        self, user_id: UUID, start_date: date, end_date: date
    ) -> dict:
        """Total income, expense and balance for a closed period [start, end)."""
        date_filter = [
            Transaction.user_id == user_id,
            Transaction.transaction_date >= start_date,
            Transaction.transaction_date < end_date,
        ]

        income_stmt = select(
            func.coalesce(func.sum(Transaction.amount), 0)
        ).where(
            *date_filter,
            Transaction.type == "income",
        )

        expense_stmt = select(
            func.coalesce(func.sum(Transaction.amount), 0)
        ).where(
            *date_filter,
            Transaction.type == "expense",
        )

        total_income: Decimal = self.db.scalar(income_stmt) or Decimal("0")
        total_expense: Decimal = self.db.scalar(expense_stmt) or Decimal("0")

        return {
            "total_income": total_income,
            "total_expense": total_expense,
            "period_balance": total_income - total_expense,
        }

    def get_expense_by_category(
        self, user_id: UUID, start_date: date, end_date: date
    ):
        """Expense totals grouped by category for a period."""
        stmt = (
            select(
                Category.id,
                Category.name,
                func.coalesce(func.sum(Transaction.amount), 0).label("total"),
            )
            .join(Category, Category.id == Transaction.category_id)
            .where(
                Transaction.user_id == user_id,
                Transaction.type == "expense",
                Transaction.transaction_date >= start_date,
                Transaction.transaction_date < end_date,
            )
            .group_by(Category.id, Category.name)
            .order_by(func.sum(Transaction.amount).desc())
        )
        return self.db.execute(stmt).all()
