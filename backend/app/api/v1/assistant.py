from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.schemas.assistant import AssistantChatRequest, AssistantChatResponse
from app.services.assistant_service import AssistantService

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/chat", response_model=AssistantChatResponse)
def chat_with_assistant(
    payload: AssistantChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return AssistantService(db).chat(current_user, payload.message.strip())
