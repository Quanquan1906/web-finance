from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class BudgetCreate(BaseModel):
    category_id: UUID
    year: int = Field(ge=2000, le=2100)
    month: int = Field(ge=1, le=12)
    amount_limit: Decimal = Field(gt=0, max_digits=14, decimal_places=2)


class BudgetUpdate(BaseModel):
    category_id: UUID | None = None
    year: int | None = Field(default=None, ge=2000, le=2100)
    month: int | None = Field(default=None, ge=1, le=12)
    amount_limit: Decimal | None = Field(default=None, gt=0, max_digits=14, decimal_places=2)


class BudgetResponse(BaseModel):
    id: UUID
    user_id: UUID
    category_id: UUID
    year: int
    month: int
    amount_limit: Decimal
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BudgetProgressItem(BaseModel):
    budget_id: UUID
    category_id: UUID
    category_name: str
    year: int
    month: int
    amount_limit: Decimal
    spent: Decimal
    remaining: Decimal
    percentage_used: Decimal
    is_over_budget: bool