from datetime import date
from decimal import Decimal
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.transaction import Transaction


class TransactionRepository:
    def __init__(self, db: Session):
        # Nhận DB session từ service truyền vào
        self.db = db

    def list_by_user_id(self, user_id: UUID) -> list[Transaction]:
        # Lấy toàn bộ transaction của 1 user
        stmt = (
            select(Transaction)
            .where(Transaction.user_id == user_id)
            .order_by(Transaction.transaction_date.desc(), Transaction.created_at.desc())
        )
        return list(self.db.scalars(stmt).all())

    def get_by_id_for_user(self, transaction_id: UUID, user_id: UUID) -> Transaction | None:
        # Lấy 1 transaction theo id nhưng phải đúng owner
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
        # Tạo transaction mới
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
        # Xóa transaction khỏi DB
        self.db.delete(transaction)