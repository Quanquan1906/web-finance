"""
GeminiReceiptExtractor — sends receipt image to Gemini API and returns a
minimal structured preview with 3 fields only.

Does NOT touch the database.
Does NOT auto-save any transaction.
"""

from __future__ import annotations

import json
import logging

from google import genai
from google.genai import types

from app.core.config import settings
from app.schemas.receipt_ocr import ReceiptQuickPreview

logger = logging.getLogger(__name__)

_PROMPT = """\
Extract only 3 fields from this receipt image.

Return ONLY minified JSON:
{"transaction_type":"expense|income|null","amount":number|null,"category_suggestion":"food|shopping|transport|health|entertainment|bill|education|other|null"}

Rules:
- Usually receipts are expense.
- amount is the final payable total only (integer, no decimals).
- Do not use invoice number, order number, tax, subtotal, phone number, quantity, discount, or change as the amount.
- category_suggestion must be one of the allowed values or null.
- No markdown.
- No explanation.
- No raw text.\
"""


class GeminiReceiptExtractor:
    """Calls Gemini multimodal API to extract a quick receipt preview."""

    def __init__(self) -> None:
        if not settings.gemini_api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is not configured. "
                "Add it to your .env file."
            )
        self._client = genai.Client(api_key=settings.gemini_api_key)
        self._model = settings.gemini_model

    def extract_quick_preview(
        self,
        image_bytes: bytes,
        mime_type: str,
    ) -> ReceiptQuickPreview:
        """
        Send the image to Gemini and parse the JSON response.

        Falls back to an all-None preview when Gemini returns unparseable output
        so the frontend always gets a valid (if empty) response.
        """
        image_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)

        try:
            response = self._client.models.generate_content(
                model=self._model,
                contents=[image_part, _PROMPT],
            )
        except Exception as exc:
            logger.error("Gemini API call failed: %s", exc)
            raise RuntimeError(f"Gemini API error: {exc}") from exc

        raw = (response.text or "").strip()
        logger.debug("Gemini raw response: %s", raw)

        return self._parse_response(raw)

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _parse_response(self, raw: str) -> ReceiptQuickPreview:
        """
        Parse minified JSON from Gemini into ReceiptQuickPreview.

        Returns an all-None fallback on any parse / validation error
        so the backend never crashes due to bad Gemini output.
        """
        # Strip accidental markdown fences (```json ... ```)
        text = raw
        if text.startswith("```"):
            lines = text.splitlines()
            text = "\n".join(
                line for line in lines if not line.startswith("```")
            ).strip()

        try:
            data = json.loads(text)
        except json.JSONDecodeError:
            logger.warning("Gemini returned non-JSON: %r", raw)
            return ReceiptQuickPreview()

        # Normalise "null" strings to Python None
        for key in ("transaction_type", "amount", "category_suggestion"):
            if data.get(key) == "null":
                data[key] = None

        try:
            return ReceiptQuickPreview.model_validate(data)
        except Exception as exc:
            logger.warning("Gemini response failed validation (%s): %r", exc, data)
            return ReceiptQuickPreview()
