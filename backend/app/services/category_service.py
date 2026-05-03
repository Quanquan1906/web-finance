from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.category_repository import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:
    def __init__(self, db: Session):
        self.db = db
        self.category_repo = CategoryRepository(db)

    def list_my_categories(self, current_user: User):
        return self.category_repo.list_by_user_id(current_user.id)

    def create_category(self, current_user: User, payload: CategoryCreate):
        existing = self.category_repo.get_by_name_for_user(
            current_user.id,
            payload.name,
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
            )
            self.db.commit()
            self.db.refresh(category)
            return category
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

        existing = self.category_repo.get_by_name_for_user(
            current_user.id,
            payload.name,
        )
        if existing and existing.id != category.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category already exists",
            )

        try:
            category.name = payload.name.strip()
            self.db.add(category)
            self.db.commit()
            self.db.refresh(category)
            return category
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

        try:
            self.category_repo.delete(category)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise