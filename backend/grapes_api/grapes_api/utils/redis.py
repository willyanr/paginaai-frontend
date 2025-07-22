import redis
from django.conf import settings

_redis_client = None

def get_redis_connection():
    """
    Retorna uma conexão singleton com o Redis
    """
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.REDIS_DB,
            decode_responses=True
        )
    return _redis_client