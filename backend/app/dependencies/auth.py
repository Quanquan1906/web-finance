from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.db.db import get_db
from app.services.auth_service import get_current_user_from_access_token

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    conn=Depends(get_db),
):
    return await get_current_user_from_access_token(
        conn,
        credentials.credentials,
    )