from datetime import date
from decimal import Decimal
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.transaction import Transaction


class ReportRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_summary(self, user_id: UUID, date_from: date | None = None, date_to: date | None = None) -> dict:
        income_stmt = select(func.coalesce(func.sum(Transaction.amount), 0)).where(
            Transaction.user_id == user_id,
            Transaction.type == "income",
        )
        expense_stmt = select(func.coalesce(func.sum(Transaction.amount), 0)).where(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
        )
        
        if date_from is not None:
            income_stmt = income_stmt.where(Transaction.transaction_date >= date_from)
            expense_stmt = expense_stmt.where(Transaction.transaction_date >= date_from)

        if date_to is not None:
            income_stmt = income_stmt.where(Transaction.transaction_date < date_to)
            expense_stmt = expense_stmt.where(Transaction.transaction_date < date_to)

        total_income = self.db.scalar(income_stmt) or Decimal("0")
        total_expense = self.db.scalar(expense_stmt) or Decimal("0")

        return {
            "total_income": total_income,
            "total_expense": total_expense,
            "balance": total_income - total_expense,
        }

    def get_total_by_category(
        self,
        user_id: UUID,
        tx_type: str,
        date_from: date | None = None,
        date_to: date | None = None,
    ):
        stmt = (
            select(
                Category.id,
                Category.name,
                func.coalesce(func.sum(Transaction.amount), 0).label("total"),
            )
            .join(Category, Category.id == Transaction.category_id)
            .where(
                Transaction.user_id == user_id,
                Transaction.type == tx_type,
            )
        )
        if date_from is not None:
            stmt = stmt.where(Transaction.transaction_date >= date_from)

        if date_to is not None:
            stmt = stmt.where(Transaction.transaction_date < date_to)

        stmt = stmt.group_by(Category.id, Category.name).order_by(
            func.sum(Transaction.amount).desc()
        )
        
        return self.db.execute(stmt).all()

    def get_current_balance(self, user_id: UUID) -> Decimal:
        """All-time balance: sum of all income minus sum of all expense."""
        income_stmt = select(func.coalesce(func.sum(Transaction.amount), 0)).where(
            Transaction.user_id == user_id,
            Transaction.type == "income",
        )
        expense_stmt = select(func.coalesce(func.sum(Transaction.amount), 0)).where(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
        )
        total_income = self.db.scalar(income_stmt) or Decimal("0")
        total_expense = self.db.scalar(expense_stmt) or Decimal("0")
        return total_income - total_expense

    def get_expense_by_category(self, user_id: UUID, date_from: date | None = None, date_to: date | None = None):
        return self.get_total_by_category(
            user_id=user_id,
            tx_type="expense",
            date_from=date_from,
            date_to=date_to,
        )
