from datetime import date
from typing import Literal
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.schemas.transaction import (
    TransactionCreate,
    TransactionResponse,
    TransactionUpdate,
)
from app.services.transaction_service import TransactionService
from app.dependencies.pagination import PaginationParams, get_pagination_params
from app.schemas.common import PaginatedResponse

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=PaginatedResponse[TransactionResponse])
def list_my_transactions(
    date_from: date | None = Query(default=None),
    date_to: date | None = Query(default=None),
    tx_type: Literal["income", "expense"] | None = Query(default=None, alias="type"),
    pagination: PaginationParams = Depends(get_pagination_params),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return TransactionService(db).list_my_transactions(
        current_user,
        date_from=date_from,
        date_to=date_to,
        tx_type=tx_type,
        limit=pagination.limit,
        offset=pagination.offset,
    )


@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(
    transaction_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return TransactionService(db).get_my_transaction(current_user, transaction_id)


@router.post(
    "", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED
)
def create_transaction(
    payload: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return TransactionService(db).create_transaction(current_user, payload)


@router.patch("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: UUID,
    payload: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return TransactionService(db).update_transaction(
        current_user, transaction_id, payload
    )


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    transaction_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    TransactionService(db).delete_transaction(current_user, transaction_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
