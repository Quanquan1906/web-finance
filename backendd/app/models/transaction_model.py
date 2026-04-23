from datetime import date, datetime
from enum import Enum
from typing import Optional, List

from pydantic import BaseModel, Field, ConfigDict


class TransactionType(str, Enum):
    income = "income"
    expense = "expense"


class TransactionSource(str, Enum):
    manual = "manual"
    nlp = "nlp"
    ocr = "ocr"


class TransactionBase(BaseModel):
    category_id: str = Field(..., min_length=1)
    amount: int = Field(..., gt=0)
    type: TransactionType
    date: date
    note: Optional[str] = None
    source: TransactionSource = TransactionSource.manual


class CreateTransactionRequest(TransactionBase):
    pass


class UpdateTransactionRequest(BaseModel):
    category_id: Optional[str] = None
    amount: Optional[int] = Field(default=None, gt=0)
    type: Optional[TransactionType] = None
    date: Optional[date] = None
    note: Optional[str] = None
    source: Optional[TransactionSource] = None


class TransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    category_id: str
    amount: int
    type: TransactionType
    date: date
    note: Optional[str] = None
    source: TransactionSource
    created_at: datetime
    updated_at: datetime


class TransactionListResponse(BaseModel):
    items: List[TransactionResponse]
    total: int


class DeleteTransactionResponse(BaseModel):
    message: str = "Transaction deleted successfully"