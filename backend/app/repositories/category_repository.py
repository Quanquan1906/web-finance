from typing import Literal
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.transaction import Transaction

CategoryKind = Literal["income", "expense"]


class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_by_user_id(
        self,
        user_id: UUID,
        kind: CategoryKind | None = None,
    ):
        stmt = (
            select(
                Category.id,
                Category.user_id,
                Category.name,
                Category.kind,
                Category.created_at,
                func.count(Transaction.id).label("transaction_count"),
            )
            .outerjoin(
                Transaction,
                Transaction.category_id == Category.id,
            )
            .where(Category.user_id == user_id)
        )

        if kind is not None:
            stmt = stmt.where(Category.kind == kind)

        stmt = (
            stmt.group_by(
                Category.id,
                Category.user_id,
                Category.name,
                Category.kind,
                Category.created_at,
            )
            .order_by(
                Category.created_at.asc(),
                Category.name.asc(),
            )
        )

        return self.db.execute(stmt).all()

    def get_by_id_for_user(self, category_id: UUID, user_id: UUID) -> Category | None:
        stmt = select(Category).where(
            Category.id == category_id,
            Category.user_id == user_id,
        )
        return self.db.scalar(stmt)

    def get_by_name_for_user(self, user_id: UUID, name: str, kind: CategoryKind) -> Category | None:
        stmt = select(Category).where(
            Category.user_id == user_id,
            Category.name == name.strip(),
            Category.kind == kind,
        )
        return self.db.scalar(stmt)
    
    def get_duplicate_for_update(
        self,
        user_id: UUID,
        category_id: UUID,
        name: str,
        kind: CategoryKind,
    ) -> Category | None:
        stmt = select(Category).where(
            Category.user_id == user_id,
            Category.id != category_id,
            Category.name == name.strip(),
            Category.kind == kind,
        )
        return self.db.scalar(stmt)

    def create(self, user_id: UUID, name: str, kind: CategoryKind) -> Category:
        category = Category(
            user_id=user_id,
            name=name.strip(),
            kind=kind,
        )
        self.db.add(category)
        self.db.flush()
        return category

    def delete(self, category: Category) -> None:
        self.db.delete(category)