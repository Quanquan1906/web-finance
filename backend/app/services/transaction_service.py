from datetime import datetime, time, timezone
from typing import Any

from bson import ObjectId
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.repository.transaction_repository import (
    count_transactions_by_user,
    create_transaction,
    delete_transaction_by_id_and_user,
    get_transaction_by_id_and_user,
    list_transactions_by_user,
    update_transaction_by_id_and_user,
)
from app.schemas.transactions import (
    CreateTransactionRequest,
    DeleteTransactionResponse,
    TransactionListResponse,
    UpdateTransactionRequest,
)


def to_utc_start_of_day(value) -> datetime:
    return datetime.combine(value, time.min, tzinfo=timezone.utc)


def normalize_user_id(user_id: Any) -> str:
    return str(user_id)


async def validate_category_ownership(
    db: AsyncIOMotorDatabase,
    category_id: str,
    user_id: str,
) -> dict[str, Any]:
    user_id = normalize_user_id(user_id)

    if not ObjectId.is_valid(category_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid category_id",
        )

    category = await db["categories"].find_one(
        {
            "_id": ObjectId(category_id),
            "user_id": user_id,
        }
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category not found or does not belong to current user",
        )

    return category


async def list_user_transactions(
    db: AsyncIOMotorDatabase,
    user_id: str,
) -> TransactionListResponse:
    user_id = normalize_user_id(user_id)

    items = await list_transactions_by_user(db, user_id)
    total = await count_transactions_by_user(db, user_id)

    return TransactionListResponse(items=items, total=total)


async def create_user_transaction(
    db: AsyncIOMotorDatabase,
    user_id: str,
    payload: CreateTransactionRequest,
):
    user_id = normalize_user_id(user_id)

    await validate_category_ownership(db, payload.category_id, user_id)

    now = datetime.now(timezone.utc)

    transaction_doc = {
        "user_id": user_id,
        "category_id": payload.category_id,
        "amount": payload.amount,
        "type": payload.type.value,
        "date": to_utc_start_of_day(payload.date),
        "note": payload.note,
        "source": payload.source.value,
        "created_at": now,
        "updated_at": now,
    }

    return await create_transaction(db, transaction_doc)


async def update_user_transaction(
    db: AsyncIOMotorDatabase,
    user_id: str,
    transaction_id: str,
    payload: UpdateTransactionRequest,
):
    user_id = normalize_user_id(user_id)

    existing_transaction = await get_transaction_by_id_and_user(
        db,
        transaction_id,
        user_id,
    )

    if not existing_transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

    if "category_id" in update_data and update_data["category_id"] is not None:
        await validate_category_ownership(db, update_data["category_id"], user_id)

    if "type" in update_data and update_data["type"] is not None:
        update_data["type"] = update_data["type"].value

    if "source" in update_data and update_data["source"] is not None:
        update_data["source"] = update_data["source"].value

    if "date" in update_data and update_data["date"] is not None:
        update_data["date"] = to_utc_start_of_day(update_data["date"])

    update_data["updated_at"] = datetime.now(timezone.utc)

    updated_transaction = await update_transaction_by_id_and_user(
        db=db,
        transaction_id=transaction_id,
        user_id=user_id,
        update_data=update_data,
    )

    if not updated_transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    return updated_transaction


async def delete_user_transaction(
    db: AsyncIOMotorDatabase,
    user_id: str,
    transaction_id: str,
) -> DeleteTransactionResponse:
    user_id = normalize_user_id(user_id)

    existing_transaction = await get_transaction_by_id_and_user(
        db,
        transaction_id,
        user_id,
    )

    if not existing_transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    deleted = await delete_transaction_by_id_and_user(
        db,
        transaction_id,
        user_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )

    return DeleteTransactionResponse()