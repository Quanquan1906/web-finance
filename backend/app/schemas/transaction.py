from datetime import date, datetime
from decimal import Decimal
from uuid import UUID
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class TransactionCreate(BaseModel):
    category_id: UUID
    type: Literal["income", "expense"]
    amount: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    note: str | None = Field(default=None, max_length=255)
    transaction_date: date


class TransactionUpdate(BaseModel):
    category_id: UUID | None = None
    type: Literal["income", "expense"] | None = None
    amount: Decimal | None = Field(default=None, gt=0, max_digits=14, decimal_places=2)
    note: str | None = Field(default=None, max_length=255)
    transaction_date: date | None = None


class TransactionResponse(BaseModel):
    id: UUID
    user_id: UUID
    category_id: UUID
    type: str
    amount: Decimal
    note: str | None = None
    transaction_date: date
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)