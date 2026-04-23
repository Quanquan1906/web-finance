from app.db.db import AsyncIOMotorClient

from app.schemas.finance_transactions import ensure_transaction_indexes
from app.schemas.finance_categories import ensure_category_indexes
from app.schemas.finance_chat_logs import ensure_chat_log_indexes


async def ensure_finance_indexes(conn: AsyncIOMotorClient) -> None:
    await ensure_transaction_indexes(conn)
    await ensure_category_indexes(conn)
    await ensure_chat_log_indexes(conn)