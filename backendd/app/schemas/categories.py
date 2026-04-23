from datetime import datetime
from pydantic import BaseModel, Field


class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    icon: str = Field(..., min_length=1, max_length=10)
    color: str = Field(..., min_length=1, max_length=50)


class CategoryCreateRequest(CategoryBase):
    pass


class CategoryUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=50)
    icon: str | None = Field(default=None, min_length=1, max_length=10)
    color: str | None = Field(default=None, min_length=1, max_length=50)


class CategoryResponse(BaseModel):
    id: str
    name: str
    icon: str
    color: str
    is_default: bool
    user_id: str
    created_at: datetime
    updated_at: datetime


class CategoryListResponse(BaseModel):
    items: list[CategoryResponse]


class CategoryDeleteResponse(BaseModel):
    message: str
