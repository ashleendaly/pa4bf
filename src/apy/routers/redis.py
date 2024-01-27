from fastapi import APIRouter
from ..config import REDIS_HOST, REDIS_PORT, REDIS_PASSWORD

router = APIRouter()

@router.get("/test", )
async def test_redis():
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD, decode_responses=True)
    print(r)
