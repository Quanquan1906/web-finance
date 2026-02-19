from datetime import datetime
from typing import List, Optional
from uuid import UUID

from .mongo_model import MongoModel


class UserDB(MongoModel):
    id: UUID
    email: str
    password_hash: str
    name: Optional[str] = None
    roles: List[str] = ["USER"]
    is_active: bool = True
    created_at: datetime


class RefreshTokenDB(MongoModel):
    id: UUID
    user_id: UUID
    jti: str
    expires_at: datetime
    revoked: bool = False
    created_at: datetime
