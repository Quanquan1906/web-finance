from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.category import Category


class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_by_user_id(self, user_id: UUID) -> list[Category]:
        stmt = (
            select(Category)
            .where(Category.user_id == user_id)
            .order_by(Category.created_at.asc(), Category.name.asc())
        )
        return list(self.db.scalars(stmt).all())

    def get_by_id_for_user(self, category_id: UUID, user_id: UUID) -> Category | None:
        stmt = select(Category).where(
            Category.id == category_id,
            Category.user_id == user_id,
        )
        return self.db.scalar(stmt)

    def get_by_name_for_user(self, user_id: UUID, name: str) -> Category | None:
        stmt = select(Category).where(
            Category.user_id == user_id,
            Category.name == name.strip(),
        )
        return self.db.scalar(stmt)

    def create(self, user_id: UUID, name: str) -> Category:
        category = Category(
            user_id=user_id,
            name=name.strip(),
        )
        self.db.add(category)
        self.db.flush()
        return category

    def delete(self, category: Category) -> None:
        self.db.delete(category)