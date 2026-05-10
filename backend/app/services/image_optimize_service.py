"""
image_optimize_service — resize and compress images before sending to Gemini.

Reduces token usage while keeping text legible for Gemini's vision model.
"""

from __future__ import annotations

import io

from PIL import Image

_MAX_WIDTH = 1280
_JPEG_QUALITY = 75


def optimize_image_for_gemini(image_bytes: bytes) -> tuple[bytes, str]:
    """
    Resize and JPEG-compress an image to reduce Gemini token usage.

    Args:
        image_bytes: Raw bytes of the uploaded image (JPEG / PNG / WEBP).

    Returns:
        A (bytes, mime_type) tuple where mime_type is always "image/jpeg".
    """
    img = Image.open(io.BytesIO(image_bytes))

    # Convert palette / RGBA modes so JPEG save works
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")

    # Resize only if wider than _MAX_WIDTH, preserve aspect ratio
    w, h = img.size
    if w > _MAX_WIDTH:
        new_h = int(h * _MAX_WIDTH / w)
        img = img.resize((_MAX_WIDTH, new_h), Image.LANCZOS)

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=_JPEG_QUALITY, optimize=True)
    return buf.getvalue(), "image/jpeg"
