from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.db.db import get_db
from app.schemas.categories import (
    CategoryCreateRequest,
    CategoryDeleteResponse,
    CategoryListResponse,
    CategoryResponse,
    CategoryUpdateRequest,
)
from app.services.auth_service import get_me
from app.services.category_service import (
    create_category,
    delete_category,
    get_categories,
    update_category,
)
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/categories", tags=["categories"])
security = HTTPBearer()


@router.get("", response_model=CategoryListResponse)
async def list_categories(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    items = await get_categories(db, str(current_user["_id"]))
    return CategoryListResponse(items=items)


@router.post("", response_model=CategoryResponse, status_code=201)
async def create_category_endpoint(
    payload: CategoryCreateRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    current_user = await get_me(db, credentials.credentials)
    return await create_category(db, current_user.id, payload)


@router.patch("/{category_id}", response_model=CategoryResponse)
async def update_category_endpoint(
    category_id: str,
    payload: CategoryUpdateRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    current_user = await get_me(db, credentials.credentials)
    return await update_category(db, current_user.id, category_id, payload)


@router.delete("/{category_id}", response_model=CategoryDeleteResponse)
async def delete_category_endpoint(
    category_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    current_user = await get_me(db, credentials.credentials)
    result = await delete_category(db, current_user.id, category_id)
    return CategoryDeleteResponse(**result)