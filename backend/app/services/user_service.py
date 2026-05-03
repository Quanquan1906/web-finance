from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserUpdate

class UserService:
    def __init__(self, db: Session):
        self.db = db 
        
    def update_me(self, current_user: User, payload: UserUpdate) -> User:
        if payload.full_name is not None:
            current_user.full_name = payload.full_name
        
        self.db.add(current_user)
        self.db.commit()
        self.db.refresh(current_user)
        return current_user
    