from __future__ import annotations

from typing import Literal

from pydantic import BaseModel

TransactionType = Literal["expense", "income"]

CategorySuggestion = Literal[
    "food",
    "shopping",
    "transport",
    "health",
    "entertainment",
    "bill",
    "education",
    "other",
]


class ReceiptQuickPreview(BaseModel):
    """
    Minimal OCR preview returned to the frontend.
    The transaction is NOT created automatically — the user must confirm.
    """

    transaction_type: TransactionType | None = None
    amount: int | None = None
    category_suggestion: CategorySuggestion | None = None
