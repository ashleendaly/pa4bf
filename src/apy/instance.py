from src.apy.config import REDIS_HOST, REDIS_PORT, REDIS_PASSWORD
from src.apy.repository.redis import RedisRepository

redis_repo = RedisRepository(REDIS_HOST, REDIS_PORT, REDIS_PASSWORD)