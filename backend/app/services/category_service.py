from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.category_repository import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.repositories.budget_repository import BudgetRepository
from app.repositories.transaction_repository import TransactionRepository
from typing import Literal

CategoryKind = Literal["income", "expense"]


class CategoryService:
    def __init__(self, db: Session):
        self.db = db
        self.category_repo = CategoryRepository(db)
        self.budget_repo = BudgetRepository(db)
        self.transaction_repo = TransactionRepository(db)

    def list_my_categories(self, current_user: User, kind: CategoryKind | None = None):
        rows = self.category_repo.list_by_user_id(current_user.id, kind=kind)
        return [
            {
                "id": row.id,
                "user_id": row.user_id,
                "name": row.name,
                "kind": row.kind,
                "created_at": row.created_at,
                "transaction_count": row.transaction_count,
            }
            for row in rows
        ]

    def create_category(self, current_user: User, payload: CategoryCreate):
        existing = self.category_repo.get_by_name_for_user(
            current_user.id,
            payload.name,
            payload.kind,
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category already exists",
            )

        try:
            category = self.category_repo.create(
                user_id=current_user.id,
                name=payload.name,
                kind=payload.kind,
            )
            self.db.commit()
            self.db.refresh(category)
            return {
                "id": category.id,
                "user_id": category.user_id,
                "name": category.name,
                "kind": category.kind,
                "created_at": category.created_at,
                "transaction_count": 0,
            }
        except Exception:
            self.db.rollback()
            raise

    def update_category(
        self,
        current_user: User,
        category_id: UUID,
        payload: CategoryUpdate,
    ):
        category = self.category_repo.get_by_id_for_user(category_id, current_user.id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )

        duplicate = self.category_repo.get_duplicate_for_update(
            user_id=current_user.id,
            category_id=category.id,
            name=payload.name,
            kind=category.kind,
        )

        if duplicate:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category already exists in this kind",
            )

        try:
            category.name = payload.name.strip()
            self.db.add(category)
            self.db.commit()
            self.db.refresh(category)
            transaction_count = self.transaction_repo.count_by_category_for_user(
                category_id=category.id,
                user_id=current_user.id,
            )

            return {
                "id": category.id,
                "user_id": category.user_id,
                "name": category.name,
                "kind": category.kind,
                "created_at": category.created_at,
                "transaction_count": transaction_count,
            }
        except Exception:
            self.db.rollback()
            raise

    def delete_category(self, current_user: User, category_id: UUID) -> None:
        category = self.category_repo.get_by_id_for_user(category_id, current_user.id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )

        transaction_count = self.transaction_repo.count_by_category_for_user(
            category_id=category.id,
            user_id=current_user.id,
        )
        budget_count = self.budget_repo.count_by_category_for_user(
            category_id=category.id,
            user_id=current_user.id,
        )

        if transaction_count > 0 or budget_count > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete category that is being used by transactions or budgets",
            )

        try:
            self.category_repo.delete(category)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise
