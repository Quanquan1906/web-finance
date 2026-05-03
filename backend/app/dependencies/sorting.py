from typing import Annotated, Literal

from fastapi import Query
from pydantic import BaseModel


class TransactionSortingParams(BaseModel):
    sort_by: Literal["transaction_date", "amount", "created_at"] = "transaction_date"
    sort_order: Literal["asc", "desc"] = "desc"


def get_transaction_sorting_params(
    sort_by: Annotated[
        Literal["transaction_date", "amount", "created_at"],
        Query(),
    ] = "transaction_date",
    sort_order: Annotated[
        Literal["asc", "desc"],
        Query(),
    ] = "desc",
) -> TransactionSortingParams:
    return TransactionSortingParams(
        sort_by=sort_by,
        sort_order=sort_order,
    )