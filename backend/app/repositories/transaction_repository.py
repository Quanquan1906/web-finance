from datetime import date
from decimal import Decimal
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.transaction import Transaction


class TransactionRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_by_user_id(
        self,
        user_id: UUID,
        date_from: date | None = None,
        date_to: date | None = None,
        tx_type: str | None = None,
        limit: int = 20,
        offset: int = 0,
        sort_by: str = "transaction_date",
        sort_order: str = "desc",
    ) -> tuple[list[Transaction], int]:
        base_stmt = select(Transaction).where(Transaction.user_id == user_id)
        count_stmt = (
            select(func.count())
            .select_from(Transaction)
            .where(Transaction.user_id == user_id)
        )

        if date_from is not None:
            base_stmt = base_stmt.where(Transaction.transaction_date >= date_from)
            count_stmt = count_stmt.where(Transaction.transaction_date >= date_from)

        if date_to is not None:
            base_stmt = base_stmt.where(Transaction.transaction_date <= date_to)
            count_stmt = count_stmt.where(Transaction.transaction_date <= date_to)

        if tx_type is not None:
            base_stmt = base_stmt.where(Transaction.type == tx_type)
            count_stmt = count_stmt.where(Transaction.type == tx_type)

        total = self.db.scalar(count_stmt) or 0
        sort_column = {
            "transaction_date": Transaction.transaction_date,
            "amount": Transaction.amount,
            "created_at": Transaction.created_at,
        }[sort_by]

        if sort_order == "asc":
            base_stmt = base_stmt.order_by(sort_column.asc())
        else:
            base_stmt = base_stmt.order_by(sort_column.desc())

        stmt = base_stmt.limit(limit).offset(offset)

        items = list(self.db.scalars(stmt).all())
        return items, total

    def get_by_id_for_user(
        self, transaction_id: UUID, user_id: UUID
    ) -> Transaction | None:
        stmt = select(Transaction).where(
            Transaction.id == transaction_id,
            Transaction.user_id == user_id,
        )
        return self.db.scalar(stmt)

    def create(
        self,
        *,
        user_id: UUID,
        category_id: UUID,
        type: str,
        amount: Decimal,
        note: str | None,
        transaction_date: date,
    ) -> Transaction:
        transaction = Transaction(
            user_id=user_id,
            category_id=category_id,
            type=type,
            amount=amount,
            note=note,
            transaction_date=transaction_date,
        )
        self.db.add(transaction)
        self.db.flush()
        return transaction

    def count_by_category_for_user(self, category_id: UUID, user_id: UUID) -> int:
        stmt = (
            select(func.count())
            .select_from(Transaction)
            .where(
                Transaction.category_id == category_id,
                Transaction.user_id == user_id,
            )
        )
        return self.db.scalar(stmt) or 0

    def delete(self, transaction: Transaction) -> None:
        self.db.delete(transaction)

    def get_recent_with_category(
        self,
        user_id: UUID,
        date_from: date | None = None,
        date_to: date | None = None,
        limit: int = 5,
    ) -> list:
        """Return recent transactions joined with category name, ordered by date desc."""
        stmt = (
            select(Transaction, Category.name.label("category_name"))
            .join(Category, Category.id == Transaction.category_id)
            .where(Transaction.user_id == user_id)
        )

        if date_from is not None:
            stmt = stmt.where(Transaction.transaction_date >= date_from)

        if date_to is not None:
            stmt = stmt.where(Transaction.transaction_date <= date_to)

        stmt = stmt.order_by(
            Transaction.transaction_date.desc(),
            Transaction.created_at.desc(),
        ).limit(limit)

        return self.db.execute(stmt).all()
