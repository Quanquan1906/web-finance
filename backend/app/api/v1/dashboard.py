from datetime import date
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.schemas.dashboard import DashboardOverviewResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/overview", response_model=DashboardOverviewResponse)
def get_dashboard_overview(
    period: Literal["day", "month", "year"] = Query(...),
    date: date | None = Query(default=None),
    month: int | None = Query(default=None, ge=1, le=12),
    year: int | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if period == "day" and date is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="'date' is required when period is 'day'",
        )
    if period == "month" and (month is None or year is None):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="'month' and 'year' are required when period is 'month'",
        )
    if period == "year" and year is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="'year' is required when period is 'year'",
        )

    return DashboardService(db).get_overview(
        current_user=current_user,
        period=period,
        date=date,
        month=month,
        year=year,
    )