from datetime import date
from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.schemas.report import CategoryBreakdownItem, ReportSummaryResponse
from app.services.report_service import ReportService

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/summary", response_model=ReportSummaryResponse)
def get_summary(
    date_from: date | None = Query(default=None),
    date_to: date | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return ReportService(db).get_summary(current_user, date_from=date_from, date_to=date_to)


@router.get("/by-category", response_model=list[CategoryBreakdownItem])
def get_expense_by_category(
    date_from: date | None = Query(default=None),
    date_to: date | None = Query(default=None),
    tx_type: Literal["income", "expense"] = Query(default="expense", alias="type"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return ReportService(db).get_total_by_category(
        current_user,
        tx_type=tx_type,
        date_from=date_from,
        date_to=date_to,
    )
