from datetime import UTC, datetime, timedelta
import secrets
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext
import hashlib
from app.core.config import settings

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    # use when creating new user or changing password
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # use when authenticating user
    return pwd_context.verify(plain_password, hashed_password)

def hash_token(token:str) -> str:
    # hash refresh token before storing in DB for security
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def _create_token(subject: str, token_type: str, expires_delta: timedelta) -> tuple[str, datetime]:
    expires_at = datetime.now(UTC) + expires_delta
    
    payload: dict[str, Any] = {
        "sub": subject,
        "type": token_type,
        "exp": expires_at,
        "jti": secrets.token_hex(16)
    }
    
    token = jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)
    return token, expires_at

def create_refresh_token(subject: str) -> tuple[str, datetime]:
    # use when login successful, or refreshing tokens
    return _create_token(subject=subject, token_type="refresh", expires_delta=timedelta(days=settings.refresh_token_expire_days))

def create_access_token(subject: str) -> tuple[str, datetime]:
    # use when login successful, registering new user, or refreshing tokens
    return _create_token(subject=subject, token_type="access", expires_delta=timedelta(minutes=settings.access_token_expire_minutes))

def decode_token(token: str) -> dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return payload
    except JWTError as exc:
        raise ValueError("Invalid token") from exc