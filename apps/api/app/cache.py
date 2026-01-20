"""Redis cache utilities for token storage and management"""

import json
from typing import Optional

import redis.asyncio as aioredis
import structlog

from app.core.config import settings

logger = structlog.get_logger(__name__)

# Global Redis connection pool
_redis_pool: Optional[aioredis.ConnectionPool] = None
_redis_client: Optional[aioredis.Redis] = None


async def get_redis() -> aioredis.Redis:
    """Get Redis client instance (singleton)"""
    global _redis_client, _redis_pool

    if _redis_client is None:
        _redis_pool = aioredis.ConnectionPool.from_url(
            settings.REDIS_URL,
            max_connections=10,
            decode_responses=True,
        )
        _redis_client = aioredis.Redis(connection_pool=_redis_pool)
        logger.info("Redis connection pool created", url=settings.REDIS_URL)

    return _redis_client


async def close_redis() -> None:
    """Close Redis connection pool"""
    global _redis_client, _redis_pool

    if _redis_client:
        await _redis_client.close()
        _redis_client = None

    if _redis_pool:
        await _redis_pool.disconnect()
        _redis_pool = None

    logger.info("Redis connection pool closed")


# Token storage keys
REFRESH_TOKEN_PREFIX = "refresh_token:"
REVOKED_TOKEN_PREFIX = "revoked_token:"


async def store_refresh_token(userId: str, token: str, expires_in_days: int = 7) -> None:
    """
    Store refresh token in Redis with TTL

    Args:
        userId: User ID (UUID string)
        token: Refresh token string
        expires_in_days: Token expiration in days (default: 7)
    """
    redis_client = await get_redis()
    key = f"{REFRESH_TOKEN_PREFIX}{userId}:{token}"
    ttl_seconds = expires_in_days * 24 * 60 * 60  # Convert days to seconds

    await redis_client.setex(key, ttl_seconds, json.dumps({"userId": userId, "token": token}))
    logger.debug("Refresh token stored", userId=userId, ttl_days=expires_in_days)


async def get_refresh_token(userId: str, token: str) -> Optional[dict]:
    """
    Retrieve refresh token from Redis

    Args:
        userId: User ID (UUID string)
        token: Refresh token string

    Returns:
        Token data if found, None otherwise
    """
    redis_client = await get_redis()
    key = f"{REFRESH_TOKEN_PREFIX}{userId}:{token}"

    data = await redis_client.get(key)
    if data:
        return json.loads(data)

    return None


async def revoke_refresh_token(userId: str, token: str, expires_in_days: int = 7) -> None:
    """
    Revoke refresh token by moving it to revoked tokens list

    Args:
        userId: User ID (UUID string)
        token: Refresh token string
        expires_in_days: How long to keep revoked token record (default: 7)
    """
    redis_client = await get_redis()
    token_key = f"{REFRESH_TOKEN_PREFIX}{userId}:{token}"
    revoked_key = f"{REVOKED_TOKEN_PREFIX}{userId}:{token}"

    # Check if token exists
    token_data = await redis_client.get(token_key)
    if token_data:
        # Move to revoked list with same TTL
        ttl_seconds = expires_in_days * 24 * 60 * 60
        await redis_client.setex(revoked_key, ttl_seconds, token_data)
        # Delete original token
        await redis_client.delete(token_key)
        logger.info("Refresh token revoked", userId=userId)

    logger.debug("Token revocation attempted", userId=userId, token_exists=bool(token_data))


async def is_token_revoked(userId: str, token: str) -> bool:
    """
    Check if a token has been revoked

    Args:
        userId: User ID (UUID string)
        token: Refresh token string

    Returns:
        True if token is revoked, False otherwise
    """
    redis_client = await get_redis()
    revoked_key = f"{REVOKED_TOKEN_PREFIX}{userId}:{token}"

    exists = await redis_client.exists(revoked_key)
    return bool(exists)


async def revoke_all_user_tokens(userId: str) -> None:
    """
    Revoke all refresh tokens for a user (e.g., on password change or security breach)

    Args:
        userId: User ID (UUID string)
    """
    redis_client = await get_redis()
    pattern = f"{REFRESH_TOKEN_PREFIX}{userId}:*"

    # Find all tokens for this user
    keys = []
    async for key in redis_client.scan_iter(match=pattern):
        keys.append(key)

    # Delete all tokens
    if keys:
        await redis_client.delete(*keys)
        logger.info("All user tokens revoked", userId=userId, count=len(keys))

    logger.debug("Token revocation for user", userId=userId, tokens_found=len(keys))


async def delete_refresh_token(userId: str, token: str) -> None:
    """
    Delete a refresh token from Redis (used during token rotation)

    Args:
        userId: User ID (UUID string)
        token: Refresh token string
    """
    redis_client = await get_redis()
    key = f"{REFRESH_TOKEN_PREFIX}{userId}:{token}"

    deleted = await redis_client.delete(key)
    logger.debug("Refresh token deleted", userId=userId, deleted=bool(deleted))
