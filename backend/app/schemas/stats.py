import logging

from app.db.db import AsyncIOMotorClient
from app.schemas.finance_common import _db, _TX_COLLECTION


async def get_summary_stats(conn: AsyncIOMotorClient) -> dict:
    logging.info("Calculating summary stats ...")

    rows = await _db(conn)[_TX_COLLECTION].find(
        {"deleted": False}
    ).to_list(length=1000)

    total_income = sum(item["amount"] for item in rows if item["type"] == "income")
    total_expense = sum(item["amount"] for item in rows if item["type"] == "expense")
    balance = total_income - total_expense
    transaction_count = len(rows)

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "transaction_count": transaction_count,
    }


async def get_category_stats(
    conn: AsyncIOMotorClient,
    tx_type: str,
) -> list[dict]:
    logging.info(f"Calculating category stats for type={tx_type} ...")

    rows = await _db(conn)[_TX_COLLECTION].find(
        {
            "$and": [
                {"deleted": False},
                {"type": tx_type},
            ]
        }
    ).to_list(length=1000)

    summary = {}
    for item in rows:
        category = item["category"]
        amount = item["amount"]
        summary[category] = summary.get(category, 0) + amount

    return [{"category": k, "total": v} for k, v in summary.items()]