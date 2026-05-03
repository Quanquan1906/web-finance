from datetime import UTC, datetime
from uuid import UUID

from fastapi import HTTPException, status

from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.repositories.token_repository import TokenRepository
from app.schemas.auth import LoginRequest, LogoutRequest, RefreshTokenRequest, RegisterRequest, TokenResponse
from app.core.security import decode_token, hash_password, create_access_token, create_refresh_token, hash_token, verify_password



class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.token_repo = TokenRepository(db)
    
    def register(self, payload: RegisterRequest) -> TokenResponse:
        # check if user's email already exists
        existing_user = self.user_repo.get_by_email(payload.email)
        if existing_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        try:
            # create new user
            user = self.user_repo.create(email=payload.email, hashed_password=hash_password(payload.password), full_name=payload.full_name)
            # create tokens for new user
            access_token, _ = create_access_token(subject=str(user.id))
            refresh_token, refresh_expire_at = create_refresh_token(str(user.id))
            
            self.token_repo.create(user_id=user.id, token_hash=hash_token(refresh_token), expires_at=refresh_expire_at,)
            
            self.db.commit()
            
            return TokenResponse(access_token=access_token, refresh_token=refresh_token)
        
        except Exception as exc:
            self.db.rollback()
            raise
            
    def login(self, payload: LoginRequest) -> TokenResponse:
        user = self.user_repo.get_by_email(payload.email)
        
        if not user or not verify_password(payload.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is inactive")
        
        try:
            access_token, _ = create_access_token(subject=str(user.id))
            refresh_token, refresh_expire_at = create_refresh_token(str(user.id))
            self.token_repo.create(user_id=user.id, token_hash=hash_token(refresh_token), expires_at=refresh_expire_at)
            
            self.db.commit()
            
            return TokenResponse(access_token=access_token, refresh_token=refresh_token)
        
        except Exception:
            self.db.rollback()
            raise
        
    def refresh(self, payload: RefreshTokenRequest) -> TokenResponse:
        try:
            decoded = decode_token(payload.refresh_token)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        
        if decoded.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
        
        token_record =  self.token_repo.get_active_by_hash(hash_token(payload.refresh_token))
        
        if not token_record:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token not found or expired")
        
        if token_record.expires_at <= datetime.now(UTC):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

        try:
            self.token_repo.revoke(token_record)
            user_id = UUID(decoded.get("sub"))
            access_token, _ = create_access_token(str(user_id))
            refresh_token, refresh_expire_at = create_refresh_token(str(user_id))
            self.token_repo.create(user_id=user_id, token_hash=hash_token(refresh_token), expires_at=refresh_expire_at)
            self.db.commit()
            
            return TokenResponse(access_token=access_token, refresh_token=refresh_token)
        
        except Exception:
            self.db.rollback()
            raise
        
    def logout(self, payload: LogoutRequest) -> None:
        token_record = self.token_repo.get_active_by_hash(hash_token(payload.refresh_token))
        
        if not token_record:
            return
        
        try: 
            self.token_repo.revoke(token_record)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise
        
    