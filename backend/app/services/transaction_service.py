from datetime import date
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.category_repository import CategoryRepository
from app.repositories.transaction_repository import TransactionRepository
from app.schemas.transaction import TransactionCreate, TransactionResponse, TransactionUpdate
from app.schemas.common import PaginatedResponse


class TransactionService:
    def __init__(self, db: Session):
        self.db = db
        self.transaction_repo = TransactionRepository(db)
        self.category_repo = CategoryRepository(db)

    def list_my_transactions(
        self,
        current_user: User,
        date_from: date | None = None,
        date_to: date | None = None,
        tx_type: str | None = None,
        limit: int = 20,
        offset: int = 0,
        sort_by: str = "transaction_date",
        sort_order: str = "desc",
    ) -> PaginatedResponse[TransactionResponse]:
        items, total = self.transaction_repo.list_by_user_id(
            user_id=current_user.id,
            date_from=date_from,
            date_to=date_to,
            tx_type=tx_type,
            limit=limit,
            offset=offset,
            sort_by=sort_by,
            sort_order=sort_order,
        )
        return PaginatedResponse[TransactionResponse](
            items=items,
            total=total,
            limit=limit,
            offset=offset,
        )

    def get_my_transaction(self, current_user: User, transaction_id: UUID):
        transaction = self.transaction_repo.get_by_id_for_user(
            transaction_id,
            current_user.id,
        )
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found",
            )
        return transaction

    def create_transaction(self, current_user: User, payload: TransactionCreate):
        category = self.category_repo.get_by_id_for_user(
            payload.category_id,
            current_user.id,
        )
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category not found",
            )

        try:
            transaction = self.transaction_repo.create(
                user_id=current_user.id,
                category_id=payload.category_id,
                type=payload.type,
                amount=payload.amount,
                note=payload.note.strip() if payload.note else None,
                transaction_date=payload.transaction_date,
            )
            self.db.commit()
            self.db.refresh(transaction)
            return transaction
        except Exception:
            self.db.rollback()
            raise

    def update_transaction(
        self,
        current_user: User,
        transaction_id: UUID,
        payload: TransactionUpdate,
    ):
        transaction = self.transaction_repo.get_by_id_for_user(
            transaction_id,
            current_user.id,
        )
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found",
            )

        try:
            if "category_id" in payload.model_fields_set:
                if payload.category_id is None:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="category_id cannot be null",
                    )

                category = self.category_repo.get_by_id_for_user(
                    payload.category_id,
                    current_user.id,
                )
                if not category:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Category not found",
                    )

                transaction.category_id = payload.category_id

            if "type" in payload.model_fields_set:
                if payload.type is None:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="type cannot be null",
                    )
                transaction.type = payload.type

            if "amount" in payload.model_fields_set:
                if payload.amount is None:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="amount cannot be null",
                    )
                transaction.amount = payload.amount

            if "note" in payload.model_fields_set:
                transaction.note = payload.note.strip() if payload.note else None

            if "transaction_date" in payload.model_fields_set:
                if payload.transaction_date is None:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="transaction_date cannot be null",
                    )
                transaction.transaction_date = payload.transaction_date

            self.db.add(transaction)
            self.db.commit()
            self.db.refresh(transaction)
            return transaction
        except Exception:
            self.db.rollback()
            raise

    def delete_transaction(self, current_user: User, transaction_id: UUID) -> None:
        transaction = self.transaction_repo.get_by_id_for_user(
            transaction_id,
            current_user.id,
        )
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found",
            )

        try:
            self.transaction_repo.delete(transaction)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise