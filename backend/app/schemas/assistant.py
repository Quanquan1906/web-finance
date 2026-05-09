from typing import Literal

from pydantic import BaseModel, Field


AssistantIntent = Literal[
    "summary",
    "expense_by_category",
    "recent_transactions",
    "saving_advice",
    "help",
]


class AssistantChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=500)


class AssistantChatResponse(BaseModel):
    reply: str
    intent: AssistantIntent
    suggestions: list[str] = []
