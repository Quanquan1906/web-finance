from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.db.db import get_db
from app.schemas.transactions import (
    CreateTransactionRequest,
    DeleteTransactionResponse,
    TransactionListResponse,
    TransactionResponse,
    UpdateTransactionRequest,
)
from app.services.transaction_service import (
    create_user_transaction,
    delete_user_transaction,
    list_user_transactions,
    update_user_transaction,
)

from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=TransactionListResponse)
async def get_transactions(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return await list_user_transactions(
        db=db,
        user_id=current_user["_id"],
    )


@router.post(
    "",
    response_model=TransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_transaction(
    payload: CreateTransactionRequest,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return await create_user_transaction(
        db=db,
        user_id=current_user["_id"],
        payload=payload,
    )


@router.patch("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: str,
    payload: UpdateTransactionRequest,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return await update_user_transaction(
        db=db,
        user_id=current_user["_id"],
        transaction_id=transaction_id,
        payload=payload,
    )


@router.delete(
    "/{transaction_id}",
    response_model=DeleteTransactionResponse,
)
async def delete_transaction(
    transaction_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return await delete_user_transaction(
        db=db,
        user_id=current_user["_id"],
        transaction_id=transaction_id,
    )