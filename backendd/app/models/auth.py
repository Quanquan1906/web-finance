# Note: this project's models/ holds Pydantic request/response shapes;
#       DB-access functions live in schemas/ (see schemas/sample_resource.py).
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


class RegisterReq(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None


class RegisterResp(BaseModel):
    id: UUID
    email: str
    name: Optional[str] = None
    roles: List[str]


class LoginReq(BaseModel):
    email: EmailStr
    password: str


class UserInfo(BaseModel):
    id: UUID
    email: str
    name: Optional[str] = None
    roles: List[str]


class LoginResp(BaseModel):
    accessToken: str
    refreshToken: str
    user: UserInfo


class RefreshReq(BaseModel):
    refreshToken: str


class RefreshResp(BaseModel):
    accessToken: str


class LogoutReq(BaseModel):
    refreshToken: str


class LogoutResp(BaseModel):
    ok: bool
