from typing import Any

from bson import ObjectId


def _category_collection(db):
    return db.categories


async def list_categories_by_user(db, user_id: str) -> list[dict[str, Any]]:
    return (
        await _category_collection(db)
        .find({"user_id": user_id})
        .sort("created_at", 1)
        .to_list(length=None)
    )


async def get_category_by_id(
    db,
    category_id: str,
    user_id: str,
) -> dict[str, Any] | None:
    if not ObjectId.is_valid(category_id):
        return None

    return await _category_collection(db).find_one(
        {
            "_id": ObjectId(category_id),
            "user_id": user_id,
        }
    )


async def get_category_by_name(
    db,
    user_id: str,
    name_normalized: str,
) -> dict[str, Any] | None:
    return await _category_collection(db).find_one(
        {
            "user_id": user_id,
            "name_normalized": name_normalized,
        }
    )


async def get_category_by_name_excluding_id(
    db,
    user_id: str,
    name_normalized: str,
    category_id: str,
) -> dict[str, Any] | None:
    if not ObjectId.is_valid(category_id):
        return None

    return await _category_collection(db).find_one(
        {
            "_id": {"$ne": ObjectId(category_id)},
            "user_id": user_id,
            "name_normalized": name_normalized,
        }
    )


async def create_category(
    db,
    doc: dict[str, Any],
) -> dict[str, Any]:
    result = await _category_collection(db).insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc


async def update_category(
    db,
    category_id: str,
    user_id: str,
    update_data: dict[str, Any],
) -> dict[str, Any] | None:
    if not ObjectId.is_valid(category_id):
        return None

    await _category_collection(db).update_one(
        {
            "_id": ObjectId(category_id),
            "user_id": user_id,
        },
        {
            "$set": update_data,
        },
    )

    return await _category_collection(db).find_one(
        {
            "_id": ObjectId(category_id),
            "user_id": user_id,
        }
    )


async def delete_category(
    db,
    category_id: str,
    user_id: str,
) -> bool:
    if not ObjectId.is_valid(category_id):
        return False

    result = await _category_collection(db).delete_one(
        {
            "_id": ObjectId(category_id),
            "user_id": user_id,
        }
    )
    return result.deleted_count > 0


async def count_categories_by_user(
    db,
    user_id: str,
) -> int:
    return await _category_collection(db).count_documents({"user_id": user_id})


async def create_many_categories(
    db,
    docs: list[dict[str, Any]],
) -> None:
    if not docs:
        return

    await _category_collection(db).insert_many(docs)
