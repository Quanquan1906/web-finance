from sqlalchemy.orm import Session
from app.models.refresh_token import RefreshToken
from uuid import UUID
from datetime import datetime
from sqlalchemy import select

class TokenRepository:
    def __init__(self, db: Session):
        # get db session from service injection
        self.db= db
        
    def create(self, *, user_id: UUID, token_hash: str, expires_at: datetime) -> RefreshToken:
        token = RefreshToken(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at
        )
        self.db.add(token)
        self.db.flush()  # flush to get id of new token
        return token
    
    def get_active_by_hash(self, token_hash: str) -> RefreshToken | None:
        stmt = select(RefreshToken).where(
            RefreshToken.token_hash == token_hash,
            RefreshToken.revoked_at.is_(None),  
        )
        return self.db.scalar(stmt)
    
    def revoke(self, token: RefreshToken) -> None:
        # mark token as revoked by setting revoked_at to current time
        token.revoked_at = datetime.utcnow()
        self.db.add(token)
    