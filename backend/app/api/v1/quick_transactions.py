from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.schemas.quick_transaction import (
    QuickTransactionParseRequest,
    QuickTransactionParseResponse,
)
from app.services.quick_transaction_service import QuickTransactionService

router = APIRouter(prefix="/transactions", tags=["quick-transactions"])


@router.post("/quick-parse", response_model=QuickTransactionParseResponse)
def quick_parse_transaction(
    payload: QuickTransactionParseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return QuickTransactionService(db).parse(current_user, payload)
