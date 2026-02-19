import logging
from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo.errors import DuplicateKeyError

from app.db.db import get_db, AsyncIOMotorClient
from app.common.error import BadRequest, UnauthorizedError
from app.common.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    TOKEN_TYPE_ACCESS,
    TOKEN_TYPE_REFRESH,
)
from app.schemas.auth import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    create_refresh_token_record,
    get_refresh_token_by_jti,
    revoke_refresh_token,
)
from app.models.auth import (
    RegisterReq,
    RegisterResp,
    LoginReq,
    LoginResp,
    UserInfo,
    RefreshReq,
    RefreshResp,
    LogoutReq,
    LogoutResp,
)

router = APIRouter()
_bearer = HTTPBearer()


# ---------------------------------------------------------------------------
# Dependency: resolve the current user from an access token
# ---------------------------------------------------------------------------

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
    db: AsyncIOMotorClient = Depends(get_db),
) -> dict:
    payload = decode_token(credentials.credentials)
    if payload.get("type") != TOKEN_TYPE_ACCESS:
        raise UnauthorizedError([{"message": "Invalid token type"}])
    user = await get_user_by_id(db, UUID(payload["sub"]))
    if user is None or not user.get("is_active"):
        raise UnauthorizedError([{"message": "User not found or inactive"}])
    return user


# ---------------------------------------------------------------------------
# POST /register
# ---------------------------------------------------------------------------

@router.post("/register", response_model=RegisterResp, status_code=201)
async def register(
    body: RegisterReq,
    db: AsyncIOMotorClient = Depends(get_db),
):
    logging.info(f"Register request for {body.email}")
    try:
        user = await create_user(
            db,
            email=body.email,
            password_hash=hash_password(body.password),
            name=body.name,
        )
    except DuplicateKeyError:
        raise BadRequest([{"message": "Email already registered"}])

    return RegisterResp(
        id=user.id,
        email=user.email,
        name=user.name,
        roles=user.roles,
    )


# ---------------------------------------------------------------------------
# POST /login
# ---------------------------------------------------------------------------

@router.post("/login", response_model=LoginResp)
async def login(
    body: LoginReq,
    db: AsyncIOMotorClient = Depends(get_db),
):
    logging.info(f"Login request for {body.email}")
    user_doc = await get_user_by_email(db, body.email)

    if user_doc is None or not verify_password(
        body.password, user_doc["password_hash"]
    ):
        raise BadRequest([{"message": "Invalid email or password"}])

    if not user_doc.get("is_active"):
        raise BadRequest([{"message": "Account is inactive"}])

    user_id = user_doc["_id"]
    roles = user_doc.get("roles", ["USER"])

    access_token = create_access_token(user_id, roles)
    refresh_token_str, jti, expires_at = create_refresh_token(user_id)

    await create_refresh_token_record(db, user_id, jti, expires_at)

    return LoginResp(
        accessToken=access_token,
        refreshToken=refresh_token_str,
        user=UserInfo(
            id=user_id,
            email=user_doc["email"],
            name=user_doc.get("name"),
            roles=roles,
        ),
    )


# ---------------------------------------------------------------------------
# POST /refresh
# ---------------------------------------------------------------------------

@router.post("/refresh", response_model=RefreshResp)
async def refresh(
    body: RefreshReq,
    db: AsyncIOMotorClient = Depends(get_db),
):
    payload = decode_token(body.refreshToken)

    if payload.get("type") != TOKEN_TYPE_REFRESH:
        raise UnauthorizedError([{"message": "Invalid token type"}])

    jti = payload.get("jti")
    if not jti:
        raise UnauthorizedError([{"message": "Missing jti"}])

    record = await get_refresh_token_by_jti(db, jti)
    if record is None:
        raise UnauthorizedError([{"message": "Refresh token not found"}])
    if record.get("revoked"):
        raise UnauthorizedError([{"message": "Refresh token has been revoked"}])

    user_id = UUID(payload["sub"])
    user_doc = await get_user_by_id(db, user_id)
    if user_doc is None or not user_doc.get("is_active"):
        raise UnauthorizedError([{"message": "User not found or inactive"}])

    access_token = create_access_token(user_id, user_doc.get("roles", ["USER"]))
    return RefreshResp(accessToken=access_token)


# ---------------------------------------------------------------------------
# POST /logout
# ---------------------------------------------------------------------------

@router.post("/logout", response_model=LogoutResp)
async def logout(
    body: LogoutReq,
    db: AsyncIOMotorClient = Depends(get_db),
):
    payload = decode_token(body.refreshToken)

    if payload.get("type") != TOKEN_TYPE_REFRESH:
        raise UnauthorizedError([{"message": "Invalid token type"}])

    jti = payload.get("jti")
    if not jti:
        raise UnauthorizedError([{"message": "Missing jti"}])

    await revoke_refresh_token(db, jti)
    return LogoutResp(ok=True)


# ---------------------------------------------------------------------------
# GET /me
# ---------------------------------------------------------------------------

@router.get("/me", response_model=UserInfo)
async def me(current_user: dict = Depends(get_current_user)):
    return UserInfo(
        id=current_user["_id"],
        email=current_user["email"],
        name=current_user.get("name"),
        roles=current_user.get("roles", ["USER"]),
    )
