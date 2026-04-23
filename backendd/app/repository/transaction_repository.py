from datetime import datetime, timezone
from typing import Any, Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase


COLLECTION_NAME = "transactions"


def get_transaction_collection(db: AsyncIOMotorDatabase):
    return db[COLLECTION_NAME]


def serialize_transaction(doc: dict[str, Any]) -> dict[str, Any]:
    raw_date = doc.get("date")

    if isinstance(raw_date, datetime):
        response_date = raw_date.date()
    else:
        response_date = raw_date

    return {
        "id": str(doc["_id"]),
        "user_id": doc["user_id"],
        "category_id": doc["category_id"],
        "amount": doc["amount"],
        "type": doc["type"],
        "date": response_date,
        "note": doc.get("note"),
        "source": doc.get("source", "manual"),
        "created_at": doc["created_at"],
        "updated_at": doc["updated_at"],
    }


async def create_transaction(
    db: AsyncIOMotorDatabase,
    data: dict[str, Any],
) -> dict[str, Any]:
    collection = get_transaction_collection(db)

    result = await collection.insert_one(data)
    created_doc = await collection.find_one({"_id": result.inserted_id})

    return serialize_transaction(created_doc)


async def list_transactions_by_user(
    db: AsyncIOMotorDatabase,
    user_id: str,
) -> list[dict[str, Any]]:
    collection = get_transaction_collection(db)

    cursor = (
        collection
        .find({"user_id": user_id})
        .sort([
            ("date", -1),
            ("created_at", -1),
        ])
    )

    docs = await cursor.to_list(length=None)
    return [serialize_transaction(doc) for doc in docs]


async def count_transactions_by_user(
    db: AsyncIOMotorDatabase,
    user_id: str,
) -> int:
    collection = get_transaction_collection(db)
    return await collection.count_documents({"user_id": user_id})


async def get_transaction_by_id_and_user(
    db: AsyncIOMotorDatabase,
    transaction_id: str,
    user_id: str,
) -> Optional[dict[str, Any]]:
    collection = get_transaction_collection(db)

    if not ObjectId.is_valid(transaction_id):
        return None

    doc = await collection.find_one(
        {
            "_id": ObjectId(transaction_id),
            "user_id": user_id,
        }
    )

    if not doc:
        return None

    return serialize_transaction(doc)


async def update_transaction_by_id_and_user(
    db: AsyncIOMotorDatabase,
    transaction_id: str,
    user_id: str,
    update_data: dict[str, Any],
) -> Optional[dict[str, Any]]:
    collection = get_transaction_collection(db)

    if not ObjectId.is_valid(transaction_id):
        return None

    await collection.update_one(
        {
            "_id": ObjectId(transaction_id),
            "user_id": user_id,
        },
        {
            "$set": update_data,
        },
    )

    updated_doc = await collection.find_one(
        {
            "_id": ObjectId(transaction_id),
            "user_id": user_id,
        }
    )

    if not updated_doc:
        return None

    return serialize_transaction(updated_doc)


async def delete_transaction_by_id_and_user(
    db: AsyncIOMotorDatabase,
    transaction_id: str,
    user_id: str,
) -> bool:
    collection = get_transaction_collection(db)

    if not ObjectId.is_valid(transaction_id):
        return False

    result = await collection.delete_one(
        {
            "_id": ObjectId(transaction_id),
            "user_id": user_id,
        }
    )

    return result.deleted_count > 0