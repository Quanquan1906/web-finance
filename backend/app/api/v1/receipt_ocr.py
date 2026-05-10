"""
Receipt OCR endpoint.

POST /ocr/receipt-preview
    Accepts a multipart image upload, calls Gemini API, and returns a
    ReceiptQuickPreview with 3 fields only.

    The transaction is NOT created automatically — the frontend must let the
    user confirm and then call the transactions endpoint separately.
"""

from __future__ import annotations

from fastapi import APIRouter, File, UploadFile

from app.schemas.receipt_ocr import ReceiptQuickPreview
from app.services.receipt_extraction_service import ReceiptExtractionService

router = APIRouter(prefix="/ocr", tags=["OCR"])


@router.post("/receipt-preview", response_model=ReceiptQuickPreview)
async def extract_receipt_preview(
    file: UploadFile = File(...),
) -> ReceiptQuickPreview:
    """
    Upload a receipt image and receive a quick 3-field preview.

    Returns transaction_type, amount, and category_suggestion extracted by
    Gemini.  All fields may be null when Gemini cannot determine the value.
    """
    service = ReceiptExtractionService()
    return await service.extract_quick_preview_from_upload(file)
