from google import genai

from app.core.config import settings


class GeminiService:
    def __init__(self):
        if not settings.gemini_api_key:
            raise ValueError("Missing GEMINI_API_KEY")

        self.client = genai.Client(api_key=settings.gemini_api_key)

    def generate_finance_reply(self, *, user_message: str, finance_context: str) -> str:
        prompt = f"""
Bạn là trợ lý tài chính cá nhân trong app FinTrack.

Quy tắc:
- Trả lời bằng tiếng Việt.
- Dựa trên dữ liệu được cung cấp, không tự bịa số liệu.
- Nếu thiếu dữ liệu, nói rõ là chưa đủ dữ liệu.
- Không đưa lời khuyên đầu tư rủi ro.
- Câu trả lời ngắn gọn, dễ hiểu.

Dữ liệu tài chính:
{finance_context}

Câu hỏi người dùng:
{user_message}
"""

        response = self.client.models.generate_content(
            model=settings.gemini_model,
            contents=prompt,
        )

        return response.text or "Mình chưa tạo được câu trả lời lúc này."
