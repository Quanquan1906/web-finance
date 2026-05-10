"""
ReceiptExtractionService — orchestrates the receipt OCR preview flow.

Flow:
    UploadFile (image bytes)
    → validate MIME type
    → optimize image (resize/compress for Gemini)
    → GeminiReceiptExtractor.extract_quick_preview()
    → return ReceiptQuickPreview

Does NOT touch the database.
Does NOT auto-save any transaction.
"""

from __future__ import annotations

import logging

from fastapi import HTTPException, UploadFile, status

from app.schemas.receipt_ocr import ReceiptQuickPreview
from app.services.extractors.gemini_receipt_extractor import GeminiReceiptExtractor
from app.services.image_optimize_service import optimize_image_for_gemini

logger = logging.getLogger(__name__)

_ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
_MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB before optimization


class ReceiptExtractionService:
    """High-level service consumed by the OCR router."""

    def __init__(self) -> None:
        try:
            self._extractor = GeminiReceiptExtractor()
        except RuntimeError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=str(exc),
            ) from exc

    async def extract_quick_preview_from_upload(
        self,
        file: UploadFile,
    ) -> ReceiptQuickPreview:
        """
        Read the uploaded file, optimize it, call Gemini, and return the preview.
        """
        if file.content_type not in _ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only image files are supported (JPEG, PNG, WEBP).",
            )

        image_bytes = await file.read()

        if not image_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty.",
            )

        if len(image_bytes) > _MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File too large. Please upload an image smaller than 10 MB.",
            )

        try:
            optimized_bytes, mime_type = optimize_image_for_gemini(image_bytes)
        except Exception as exc:
            logger.warning("Image optimization failed, using original: %s", exc)
            optimized_bytes = image_bytes
            mime_type = file.content_type or "image/jpeg"

        try:
            return self._extractor.extract_quick_preview(
                image_bytes=optimized_bytes,
                mime_type=mime_type,
            )
        except RuntimeError as exc:
            logger.error("Gemini extraction failed: %s", exc)
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=str(exc),
            ) from exc
