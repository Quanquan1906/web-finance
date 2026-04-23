from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.db.db import get_db
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    LogoutResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    RegisterRequest,
    RegisterResponse,
    UserResponse,
)
from app.services.auth_service import (
    get_me,
    login_user,
    logout_user,
    refresh_access_token,
    register_user,
)

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()


@router.post("/register", response_model=RegisterResponse, status_code=201)
async def register(
    payload: RegisterRequest,
    db: AsyncIOMotorDatabase = Depends(get_db), # type: ignore
):
    return await register_user(db, payload)


@router.post("/login", response_model=LoginResponse)
async def login(
    payload: LoginRequest,
    db: AsyncIOMotorDatabase = Depends(get_db), # type: ignore
):
    return await login_user(db, payload)


@router.post("/refresh", response_model=RefreshTokenResponse)
async def refresh(
    payload: RefreshTokenRequest,
    db: AsyncIOMotorDatabase = Depends(get_db), # type: ignore
):
    return await refresh_access_token(db, payload)


@router.post("/logout", response_model=LogoutResponse)
async def logout(
    payload: LogoutRequest,
    db: AsyncIOMotorDatabase = Depends(get_db), # type: ignore
):
    return await logout_user(db, payload)


@router.get("/me", response_model=UserResponse)
async def me(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncIOMotorDatabase = Depends(get_db), # type: ignore
):
    return await get_me(db, credentials.credentials)