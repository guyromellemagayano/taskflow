"""Authentication dependencies"""

from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.auth.jwt import verify_token

security = HTTPBearer()


async def get_current_user_dependency(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Dependency to get current authenticated user"""
    token = credentials.credentials
    payload = verify_token(token)
    # Phase 1: Return payload
    # Phase 2: Will fetch user from database
    return {
        "user_id": payload.get("sub"),
        "email": payload.get("email"),
    }
