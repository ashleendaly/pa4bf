from src.apy.config import REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, BEAMS_INSTANCE_ID, BEAMS_SECRET_KEY
from src.apy.repository.redis import RedisRepository
from src.apy.repository.beams import BeamsRepository

redis_repo = RedisRepository(REDIS_HOST, REDIS_PORT, REDIS_PASSWORD)
beams_repo = BeamsRepository(BEAMS_INSTANCE_ID, BEAMS_SECRET_KEY)