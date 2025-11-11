"""
Redis client configuration for caching and real-time features
"""
import redis.asyncio as redis
import json
from typing import Optional, Any
from app.core.config import settings


class RedisClient:
    """
    Redis client wrapper for caching and pub/sub
    """
    
    def __init__(self):
        self._redis = None
    
    async def connect(self):
        """Connect to Redis"""
        if not self._redis:
            self._redis = await redis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True
            )
        return self._redis
    
    async def disconnect(self):
        """Disconnect from Redis"""
        if self._redis:
            await self._redis.close()
            self._redis = None
    
    async def get(self, key: str) -> Optional[str]:
        """Get value from Redis"""
        if not self._redis:
            await self.connect()
        return await self._redis.get(key)
    
    async def set(self, key: str, value: Any, expire: Optional[int] = None):
        """Set value in Redis with optional expiration"""
        if not self._redis:
            await self.connect()
        
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        
        if expire:
            await self._redis.setex(key, expire, value)
        else:
            await self._redis.set(key, value)
    
    async def delete(self, key: str):
        """Delete key from Redis"""
        if not self._redis:
            await self.connect()
        await self._redis.delete(key)
    
    async def exists(self, key: str) -> bool:
        """Check if key exists"""
        if not self._redis:
            await self.connect()
        return await self._redis.exists(key) > 0
    
    async def expire(self, key: str, seconds: int):
        """Set expiration on key"""
        if not self._redis:
            await self.connect()
        await self._redis.expire(key, seconds)
    
    async def get_json(self, key: str) -> Optional[dict]:
        """Get JSON value from Redis"""
        value = await self.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return None
        return None
    
    async def set_json(self, key: str, value: dict, expire: Optional[int] = None):
        """Set JSON value in Redis"""
        await self.set(key, json.dumps(value), expire)
    
    async def incr(self, key: str) -> int:
        """Increment value"""
        if not self._redis:
            await self.connect()
        return await self._redis.incr(key)
    
    async def publish(self, channel: str, message: Any):
        """Publish message to channel"""
        if not self._redis:
            await self.connect()
        
        if isinstance(message, (dict, list)):
            message = json.dumps(message)
        
        await self._redis.publish(channel, message)
    
    async def ping(self):
        """Ping Redis to check connection"""
        if not self._redis:
            await self.connect()
        return await self._redis.ping()
    
    async def close(self):
        """Close Redis connection"""
        if self._redis:
            await self._redis.close()


# Create global Redis client instance
redis_client = RedisClient()
