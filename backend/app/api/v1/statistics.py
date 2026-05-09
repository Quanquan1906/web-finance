from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.schemas.statistics import StatisticsCompareResponse
from app.services.statistics_service import StatisticsService

router = APIRouter(prefix="/statistics", tags=["statistics"])


@router.get("/compare", response_model=StatisticsCompareResponse)
def compare_statistics(
    period: Literal["month"] = Query(default="month"),
    current_month: int = Query(..., ge=1, le=12),
    current_year: int = Query(..., ge=2000, le=2100),
    compare_month: int = Query(..., ge=1, le=12),
    compare_year: int = Query(..., ge=2000, le=2100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return StatisticsService(db).compare_months(
        user_id=current_user.id,
        current_month=current_month,
        current_year=current_year,
        compare_month=compare_month,
        compare_year=compare_year,
    )
