from datetime import date
from decimal import Decimal
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


class QuickTransactionParseRequest(BaseModel):
    text: str = Field(..., min_length=1)


class QuickTransactionParseResponse(BaseModel):
    type: Literal["income", "expense"]
    amount: Decimal
    transaction_date: date
    note: str
    suggested_category_name: str | None = None
    category_id: UUID | None = None
