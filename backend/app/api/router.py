from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session
from sqlalchemy import text

from app.dependencies.db import get_db

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.categories import router as categories_router
from app.api.v1.transactions import router as transactions_router
from app.api.v1.reports import router as reports_router
from app.api.v1.budgets import router as budgets_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.statistics import router as statistics_router
from app.api.v1.assistant import router as assistant_router

api_router = APIRouter()

@api_router.get("/health")
async def health_check():
    return {"status": "ok"}

@api_router.get("/health/db")
def db_health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}

api_router.include_router(auth_router)

api_router.include_router(users_router)

api_router.include_router(categories_router)

api_router.include_router(transactions_router)

api_router.include_router(reports_router)

api_router.include_router(budgets_router)

api_router.include_router(dashboard_router)

api_router.include_router(statistics_router)
api_router.include_router(assistant_router)
