from datetime import date
from decimal import Decimal
from uuid import UUID

from sqlalchemy import and_, func, select
from sqlalchemy.orm import Session

from app.models.budget import Budget
from app.models.category import Category
from app.models.transaction import Transaction


class BudgetRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_by_user_id(
        self,
        user_id: UUID,
        year: int | None = None,
        month: int | None = None,
    ) -> list[Budget]:
        stmt = select(Budget).where(Budget.user_id == user_id)

        if year is not None:
            stmt = stmt.where(Budget.year == year)

        if month is not None:
            stmt = stmt.where(Budget.month == month)

        stmt = stmt.order_by(Budget.year.desc(), Budget.month.desc(), Budget.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def get_by_id_for_user(self, budget_id: UUID, user_id: UUID) -> Budget | None:
        stmt = select(Budget).where(
            Budget.id == budget_id,
            Budget.user_id == user_id,
        )
        return self.db.scalar(stmt)

    def get_by_unique_key(
        self,
        *,
        user_id: UUID,
        category_id: UUID,
        year: int,
        month: int,
    ) -> Budget | None:
        stmt = select(Budget).where(
            Budget.user_id == user_id,
            Budget.category_id == category_id,
            Budget.year == year,
            Budget.month == month,
        )
        return self.db.scalar(stmt)

    def create(
        self,
        *,
        user_id: UUID,
        category_id: UUID,
        year: int,
        month: int,
        amount_limit: Decimal,
    ) -> Budget:
        budget = Budget(
            user_id=user_id,
            category_id=category_id,
            year=year,
            month=month,
            amount_limit=amount_limit,
        )
        self.db.add(budget)
        self.db.flush()
        return budget

    def delete(self, budget: Budget) -> None:
        self.db.delete(budget)

    def get_budget_progress(
        self,
        *,
        user_id: UUID,
        year: int,
        month: int,
        date_from: date,
        date_to: date,
    ):
        spent_subquery = (
            select(
                Transaction.category_id.label("category_id"),
                func.coalesce(func.sum(Transaction.amount), 0).label("spent"),
            )
            .where(
                Transaction.user_id == user_id,
                Transaction.type == "expense",
                Transaction.transaction_date >= date_from,
                Transaction.transaction_date <= date_to,
            )
            .group_by(Transaction.category_id)
            .subquery()
        )

        stmt = (
            select(
                Budget.id.label("budget_id"),
                Budget.category_id.label("category_id"),
                Category.name.label("category_name"),
                Budget.year.label("year"),
                Budget.month.label("month"),
                Budget.amount_limit.label("amount_limit"),
                func.coalesce(spent_subquery.c.spent, 0).label("spent"),
            )
            .join(Category, Category.id == Budget.category_id)
            .outerjoin(
                spent_subquery,
                spent_subquery.c.category_id == Budget.category_id,
            )
            .where(
                Budget.user_id == user_id,
                Budget.year == year,
                Budget.month == month,
            )
            .order_by(Category.name.asc())
        )

        return self.db.execute(stmt).all()