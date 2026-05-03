from calendar import monthrange
from datetime import date
from decimal import Decimal, ROUND_HALF_UP
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.budget_repository import BudgetRepository
from app.repositories.category_repository import CategoryRepository
from app.schemas.budget import BudgetCreate, BudgetProgressItem, BudgetUpdate


class BudgetService:
    def __init__(self, db: Session):
        self.db = db
        self.budget_repo = BudgetRepository(db)
        self.category_repo = CategoryRepository(db)

    def list_my_budgets(
        self,
        current_user: User,
        year: int | None = None,
        month: int | None = None,
    ):
        return self.budget_repo.list_by_user_id(
            user_id=current_user.id,
            year=year,
            month=month,
        )

    def create_budget(self, current_user: User, payload: BudgetCreate):
        category = self.category_repo.get_by_id_for_user(
            payload.category_id,
            current_user.id,
        )
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category not found",
            )

        existing = self.budget_repo.get_by_unique_key(
            user_id=current_user.id,
            category_id=payload.category_id,
            year=payload.year,
            month=payload.month,
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Budget already exists for this category and month",
            )

        try:
            budget = self.budget_repo.create(
                user_id=current_user.id,
                category_id=payload.category_id,
                year=payload.year,
                month=payload.month,
                amount_limit=payload.amount_limit,
            )
            self.db.commit()
            self.db.refresh(budget)
            return budget
        except Exception:
            self.db.rollback()
            raise

    def update_budget(
        self,
        current_user: User,
        budget_id: UUID,
        payload: BudgetUpdate,
    ):
        budget = self.budget_repo.get_by_id_for_user(budget_id, current_user.id)
        if not budget:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Budget not found",
            )

        new_category_id = budget.category_id
        new_year = budget.year
        new_month = budget.month

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

            new_category_id = payload.category_id

        if "year" in payload.model_fields_set:
            if payload.year is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="year cannot be null",
                )
            new_year = payload.year

        if "month" in payload.model_fields_set:
            if payload.month is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="month cannot be null",
                )
            new_month = payload.month

        duplicate = self.budget_repo.get_by_unique_key(
            user_id=current_user.id,
            category_id=new_category_id,
            year=new_year,
            month=new_month,
        )
        if duplicate and duplicate.id != budget.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Budget already exists for this category and month",
            )

        try:
            if "category_id" in payload.model_fields_set:
                budget.category_id = new_category_id

            if "year" in payload.model_fields_set:
                budget.year = new_year

            if "month" in payload.model_fields_set:
                budget.month = new_month

            if "amount_limit" in payload.model_fields_set:
                if payload.amount_limit is None:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="amount_limit cannot be null",
                    )
                budget.amount_limit = payload.amount_limit

            self.db.add(budget)
            self.db.commit()
            self.db.refresh(budget)
            return budget
        except Exception:
            self.db.rollback()
            raise

    def delete_budget(self, current_user: User, budget_id: UUID) -> None:
        budget = self.budget_repo.get_by_id_for_user(budget_id, current_user.id)
        if not budget:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Budget not found",
            )

        try:
            self.budget_repo.delete(budget)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

    def get_budget_progress(
        self,
        current_user: User,
        year: int,
        month: int,
    ) -> list[BudgetProgressItem]:
        last_day = monthrange(year, month)[1]
        date_from = date(year, month, 1)
        date_to = date(year, month, last_day)

        rows = self.budget_repo.get_budget_progress(
            user_id=current_user.id,
            year=year,
            month=month,
            date_from=date_from,
            date_to=date_to,
        )

        result: list[BudgetProgressItem] = []

        for row in rows:
            amount_limit = Decimal(row.amount_limit)
            spent = Decimal(row.spent)
            remaining = amount_limit - spent

            if amount_limit > 0:
                percentage_used = (
                    (spent / amount_limit) * Decimal("100")
                ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
            else:
                percentage_used = Decimal("0.00")

            result.append(
                BudgetProgressItem(
                    budget_id=row.budget_id,
                    category_id=row.category_id,
                    category_name=row.category_name,
                    year=row.year,
                    month=row.month,
                    amount_limit=amount_limit,
                    spent=spent,
                    remaining=remaining,
                    percentage_used=percentage_used,
                    is_over_budget=spent > amount_limit,
                )
            )

        return result