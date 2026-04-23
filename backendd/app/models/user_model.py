from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import Field, EmailStr
from .mongo_model import MongoModel
class UserDB(MongoModel):
    id: UUID
    email: EmailStr
    password_hash: str
    name: Optional[str] = None
    roles: list[str] = Field(default_factory=lambda: ["USER"])
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class RefreshTokenDB(MongoModel):
    id: UUID
    user_id: UUID
    jti: str
    expires_at: datetime
    revoked: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    revoked_at: Optional[datetime] = None