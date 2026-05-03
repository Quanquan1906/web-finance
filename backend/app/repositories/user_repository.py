from sqlalchemy.orm import Session
from sqlalchemy import select
from uuid import UUID
from app.models.user import User


class UserRepository:
    def __init__(self, db: Session):
        # get session from dependency/service injection
        self.db = db

    def get_by_id(self, user_id: UUID) -> User | None:
        return self.db.get(User, user_id)

    def get_by_email(self, email: str) -> User | None:
        stmt = select(User).where(User.email == email.lower())
        return self.db.scalar(stmt)

    def create(
        self,
        *,
        email: str,
        hashed_password: str,
        full_name: str | None = None,
    ) -> User:
        # Create new user in DB session
        user = User(
            email=email.lower(), hashed_password=hashed_password, full_name=full_name
        )
        self.db.add(user)
        self.db.flush()  # flush to get id of new user
        return user
