import logging

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.conf.config import Config

load_dotenv()

db_client: AsyncIOMotorClient | None = None # type: ignore


async def get_db() -> AsyncIOMotorDatabase: # type: ignore
    if db_client is None:
        raise RuntimeError("Mongo client is not initialized")

    db_name = Config.app_settings.get("db_name")
    if not db_name:
        raise RuntimeError("Database name is missing in config")

    return db_client[db_name]


async def connect_and_init_db() -> None:
    global db_client

    try:
        if Config.mongo_uri:
            db_client = AsyncIOMotorClient(
                Config.mongo_uri,
                maxPoolSize=Config.app_settings.get("max_db_conn_count"),
                minPoolSize=Config.app_settings.get("min_db_conn_count"),
                uuidRepresentation="standard",
            )
        else:
            db_client = AsyncIOMotorClient(
                Config.app_settings.get("mongodb_url"),
                username=Config.app_settings.get("db_username"),
                password=Config.app_settings.get("db_password"),
                maxPoolSize=Config.app_settings.get("max_db_conn_count"),
                minPoolSize=Config.app_settings.get("min_db_conn_count"),
                uuidRepresentation="standard",
            )

        logging.info("Connected to MongoDB.")
    except Exception as e:
        logging.exception(f"Could not connect to MongoDB: {e}")
        raise


async def close_db_connect() -> None:
    global db_client

    if db_client is None:
        logging.warning("Mongo client is None, nothing to close.")
        return

    db_client.close()
    db_client = None
    logging.info("Mongo connection closed.")