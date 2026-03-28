from datetime import datetime
import re
import unicodedata

from bson import ObjectId
from fastapi import HTTPException, status

from app.repository.category_repository import (
    list_categories_by_user,
    get_category_by_id,
    get_category_by_name,
    get_category_by_name_excluding_id,
    create_category as repo_create_category,
    update_category as repo_update_category,
    delete_category as repo_delete_category,
)
from app.schemas.categories import (
    CategoryCreateRequest,
    CategoryResponse,
    CategoryUpdateRequest,
)


def normalize_category_name(name: str) -> str:
    text = name.strip().lower()
    text = unicodedata.normalize("NFKD", text)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = re.sub(r"\s+", " ", text)
    return text


def category_doc_to_response(doc: dict) -> CategoryResponse:
    return CategoryResponse(
        id=str(doc["_id"]),
        name=doc["name"],
        icon=doc["icon"],
        color=doc["color"],
        is_default=doc["is_default"],
        user_id=doc["user_id"],
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
    )


async def get_categories(db, user_id: str) -> list[CategoryResponse]:
    docs = await list_categories_by_user(db, user_id)
    return [category_doc_to_response(doc) for doc in docs]


async def create_category(
    db, user_id: str, payload: CategoryCreateRequest
) -> CategoryResponse:
    cleaned_name = payload.name.strip()
    if not cleaned_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tên danh mục không được để trống.",
        )

    normalized_name = normalize_category_name(cleaned_name)

    existed = await get_category_by_name(db, user_id, normalized_name)
    if existed:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Tên danh mục đã tồn tại.",
        )

    now = datetime.utcnow()
    doc = {
        "user_id": user_id,
        "name": cleaned_name,
        "name_normalized": normalized_name,
        "icon": payload.icon,
        "color": payload.color,
        "is_default": False,
        "created_at": now,
        "updated_at": now,
    }

    created_doc = await repo_create_category(db, doc)
    return category_doc_to_response(created_doc)


async def update_category(
    db,
    user_id: str,
    category_id: str,
    payload: CategoryUpdateRequest,
) -> CategoryResponse:
    if not ObjectId.is_valid(category_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="category_id không hợp lệ.",
        )

    current_doc = await get_category_by_id(db, category_id, user_id)
    if not current_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy danh mục.",
        )

    update_data = {}

    if payload.name is not None:
        cleaned_name = payload.name.strip()
        if not cleaned_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tên danh mục không được để trống.",
            )

        normalized_name = normalize_category_name(cleaned_name)
        existed = await get_category_by_name_excluding_id(
            db,
            user_id,
            normalized_name,
            category_id,
        )
        if existed:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Tên danh mục đã tồn tại.",
            )

        update_data["name"] = cleaned_name
        update_data["name_normalized"] = normalized_name

    if payload.icon is not None:
        if not payload.icon.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Icon không được để trống.",
            )
        update_data["icon"] = payload.icon

    if payload.color is not None:
        if not payload.color.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Color không được để trống.",
            )
        update_data["color"] = payload.color

    if not update_data:
        return category_doc_to_response(current_doc)

    update_data["updated_at"] = datetime.utcnow()

    updated_doc = await repo_update_category(
        db,
        category_id,
        user_id,
        update_data,
    )

    if not updated_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy danh mục.",
        )

    return category_doc_to_response(updated_doc)


async def delete_category(db, user_id: str, category_id: str) -> dict:
    if not ObjectId.is_valid(category_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="category_id không hợp lệ.",
        )

    current_doc = await get_category_by_id(db, category_id, user_id)
    if not current_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy danh mục.",
        )

    # TODO:
    # Khi làm transactions xong, thêm check linked transactions ở đây.
    # Nếu category đang có transaction liên kết thì trả 409.

    deleted = await repo_delete_category(db, category_id, user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy danh mục.",
        )

    return {"message": "Xóa danh mục thành công."}
