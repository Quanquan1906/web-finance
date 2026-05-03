from datetime import date
from decimal import Decimal
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

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
        stmt = (
            base_stmt.order_by(
                Transaction.transaction_date.desc(),
                Transaction.created_at.desc(),
            )
            .limit(limit)
            .offset(offset)
        )

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

    def delete(self, transaction: Transaction) -> None:
        self.db.delete(transaction)
