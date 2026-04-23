from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session
from sqlalchemy import text

from app.dependencies.db import get_db

api_router = APIRouter()

@api_router.get("/health")
async def health_check():
    return {"status": "ok"}

@api_router.get("/health/db")
def db_health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}