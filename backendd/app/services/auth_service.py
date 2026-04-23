from typing import Any

from fastapi import HTTPException, status

from app.common.security import (
    TOKEN_TYPE_ACCESS,
    TOKEN_TYPE_REFRESH,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.repository.auth_repository import (
    create_refresh_token_record,
    create_user,
    get_refresh_token_by_jti,
    get_user_by_email,
    get_user_by_id,
    revoke_refresh_token,
)
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


def _bad_request(detail: str) -> HTTPException:
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


def _unauthorized(detail: str = "Unauthorized") -> HTTPException:
    return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)


def _forbidden(detail: str = "Forbidden") -> HTTPException:
    return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


def _not_found(detail: str = "Not found") -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


def _normalize_email(email: str) -> str:
    return email.strip().lower()


def _get_value(data: Any, key: str, default: Any = None) -> Any:
    if isinstance(data, dict):
        return data.get(key, default)
    return getattr(data, key, default)


def _get_user_id(user: Any) -> Any:
    if isinstance(user, dict):
        return user.get("_id") or user.get("id")
    return getattr(user, "id", None)


def _get_user_email(user: Any) -> str | None:
    return _get_value(user, "email")


def _get_user_name(user: Any) -> str | None:
    return _get_value(user, "name")


def _get_user_roles(user: Any) -> list[str]:
    roles = _get_value(user, "roles", ["USER"])
    return roles if roles else ["USER"]


def _get_user_is_active(user: Any) -> bool:
    return bool(_get_value(user, "is_active", True))


def _get_user_created_at(user: Any):
    return _get_value(user, "created_at")


def _get_user_password_hash(user: Any) -> str | None:
    return _get_value(user, "password_hash")


def _build_user_response(user: Any) -> UserResponse:
    user_id = _get_user_id(user)
    if not user_id:
        raise _not_found("User id is missing")

    return UserResponse(
        id=str(user_id),
        email=_get_user_email(user),
        name=_get_user_name(user),
        roles=_get_user_roles(user),
        is_active=_get_user_is_active(user),
        created_at=_get_user_created_at(user),
    )


def _issue_auth_payload(user: Any) -> tuple[str, str, str]:
    user_id = _get_user_id(user)
    if not user_id:
        raise _not_found("User id is missing")

    roles = _get_user_roles(user)
    access_token = create_access_token(user_id=user_id, roles=roles)
    refresh_token, jti, expires_at = create_refresh_token(user_id=user_id)
    return access_token, refresh_token, jti, expires_at


async def _persist_refresh_token(
    conn: Any, user: Any, jti: str, expires_at: Any
) -> None:
    user_id = _get_user_id(user)
    if not user_id:
        raise _not_found("User id is missing")

    await create_refresh_token_record(
        conn=conn,
        user_id=user_id,
        jti=jti,
        expires_at=expires_at,
    )


async def _get_active_user_by_id(conn: Any, user_id: str) -> Any:
    user = await get_user_by_id(conn, user_id)
    if not user:
        raise _not_found("User not found")

    if not _get_user_is_active(user):
        raise _forbidden("User is inactive")

    return user


def _require_token_type(payload: dict, expected_type: str) -> None:
    token_type = payload.get("type")
    if token_type != expected_type:
        raise _unauthorized("Invalid token type")


def _extract_sub(payload: dict) -> str:
    user_id = payload.get("sub")
    if not user_id:
        raise _unauthorized("Invalid token payload")
    return user_id


def _extract_jti(payload: dict) -> str:
    jti = payload.get("jti")
    if not jti:
        raise _unauthorized("Invalid refresh token payload")
    return jti


async def register_user(conn: Any, payload: RegisterRequest) -> RegisterResponse:
    email = _normalize_email(str(payload.email))

    existing_user = await get_user_by_email(conn, email)
    if existing_user:
        raise _bad_request("Email already exists")

    user = await create_user(
        conn=conn,
        email=email,
        password_hash=hash_password(payload.password),
        name=payload.name,
    )

    access_token, refresh_token, jti, expires_at = _issue_auth_payload(user)
    await _persist_refresh_token(conn, user, jti, expires_at)

    return RegisterResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=_build_user_response(user),
    )


async def login_user(conn: Any, payload: LoginRequest) -> LoginResponse:
    email = _normalize_email(str(payload.email))

    user = await get_user_by_email(conn, email)
    if not user:
        raise _unauthorized("Invalid credentials")

    if not _get_user_is_active(user):
        raise _forbidden("User is inactive")

    password_hash = _get_user_password_hash(user)
    if not password_hash or not verify_password(payload.password, password_hash):
        raise _unauthorized("Invalid credentials")

    access_token, refresh_token, jti, expires_at = _issue_auth_payload(user)
    await _persist_refresh_token(conn, user, jti, expires_at)

    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=_build_user_response(user),
    )


async def refresh_access_token(
    conn: Any, payload: RefreshTokenRequest
) -> RefreshTokenResponse:
    decoded = decode_token(payload.refresh_token)
    _require_token_type(decoded, TOKEN_TYPE_REFRESH)

    user_id = _extract_sub(decoded)
    jti = _extract_jti(decoded)

    token_record = await get_refresh_token_by_jti(conn, jti)
    if not token_record:
        raise _unauthorized("Refresh token not found")

    if token_record.get("revoked", False):
        raise _unauthorized("Refresh token has been revoked")

    user = await _get_active_user_by_id(conn, user_id)

    new_access_token, new_refresh_token, new_jti, new_expires_at = _issue_auth_payload(
        user
    )

    await revoke_refresh_token(conn, jti)
    await _persist_refresh_token(conn, user, new_jti, new_expires_at)

    return RefreshTokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer",
    )


async def logout_user(conn: Any, payload: LogoutRequest) -> LogoutResponse:
    decoded = decode_token(payload.refresh_token)
    _require_token_type(decoded, TOKEN_TYPE_REFRESH)

    jti = _extract_jti(decoded)
    await revoke_refresh_token(conn, jti)

    return LogoutResponse(message="Logged out successfully")


async def get_current_user_from_access_token(conn: Any, access_token: str) -> Any:
    decoded = decode_token(access_token)
    _require_token_type(decoded, TOKEN_TYPE_ACCESS)

    user_id = _extract_sub(decoded)
    return await _get_active_user_by_id(conn, user_id)


async def get_me(conn: Any, access_token: str) -> UserResponse:
    user = await get_current_user_from_access_token(conn, access_token)
    return _build_user_response(user)
