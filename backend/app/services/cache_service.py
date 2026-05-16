import os
import json
import redis
import hashlib
from typing import Optional, Any
from .gemini_service import NewsAnalysis

class CacheService:
    def __init__(self):
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.client = None
        self.memory_cache = {} # Fallback in-memory cache
        
        try:
            self.client = redis.from_url(self.redis_url, decode_responses=True)
            # Test connection
            self.client.ping()
            print(f"Connected to Redis at {self.redis_url}")
        except Exception as e:
            print(f"Redis connection failed: {e}. Using in-memory fallback.")
            self.client = None

    def _generate_key(self, content: str) -> str:
        """Generate a stable MD5 hash of the content for the cache key."""
        return f"verinews:cache:{hashlib.md5(content.encode()).hexdigest()}"

    def get_news_analysis(self, content: str) -> Optional[NewsAnalysis]:
        key = self._generate_key(content)
        
        try:
            if self.client:
                cached_data = self.client.get(key)
                if cached_data:
                    print(f"Cache Hit (Redis): {key}")
                    data = json.loads(cached_data)
                    return NewsAnalysis(**data)
            else:
                if key in self.memory_cache:
                    print(f"Cache Hit (Memory): {key}")
                    return self.memory_cache[key]
        except Exception as e:
            print(f"Cache retrieval error: {e}")
            
        return None

    def set_news_analysis(self, content: str, analysis: NewsAnalysis, ttl: int = 86400):
        """Set analysis in cache. Default TTL is 24 hours (86400 seconds)."""
        key = self._generate_key(content)
        
        try:
            # Convert NewsAnalysis (Pydantic model) to dict
            analysis_dict = analysis.model_dump()
            
            if self.client:
                self.client.set(key, json.dumps(analysis_dict), ex=ttl)
                print(f"Cache Set (Redis): {key}")
            else:
                self.memory_cache[key] = analysis
                print(f"Cache Set (Memory): {key}")
        except Exception as e:
            print(f"Cache storage error: {e}")

cache_service = CacheService()
