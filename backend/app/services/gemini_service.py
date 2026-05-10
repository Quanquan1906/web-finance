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

Vai trò của bạn:
- Chỉ hỗ trợ các câu hỏi liên quan đến tài chính cá nhân.
- Các chủ đề được phép trả lời gồm: thu nhập, chi tiêu, tổng thu chi, số dư, giao dịch, danh mục, ngân sách, tiết kiệm, phân tích thói quen chi tiêu.

Quy tắc bắt buộc:
- Trả lời bằng tiếng Việt.
- Chỉ dùng dữ liệu trong phần "Dữ liệu tài chính".
- Không tự bịa số liệu.
- Không tự tính lại nếu dữ liệu đã có sẵn, hãy dựa vào số liệu backend cung cấp.
- Nếu thiếu dữ liệu, nói rõ là chưa đủ dữ liệu.
- Không đưa lời khuyên đầu tư rủi ro.
- Câu trả lời ngắn gọn, dễ hiểu.
- Nếu câu hỏi không liên quan đến tài chính cá nhân, hãy trả lời đúng câu sau:
  "Mình là trợ lý tài chính của FinTrack, nên mình chỉ hỗ trợ các câu hỏi liên quan đến thu chi, giao dịch, danh mục, ngân sách và tiết kiệm."

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
