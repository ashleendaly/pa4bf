from io import BytesIO
import redis
import hashlib
import requests

class RedisRepository:

    def __init__(self, host, port, password):
        self.redis = redis.Redis(host=host, port=port, password=password)

    def upload_image(self, image_url):
        response = requests.get(image_url)
        image_data = response.content
        image_key = hashlib.md5(image_url.encode()).hexdigest()
        self.redis.set(image_key, image_data)
        return image_key

    def get_image(self, key):
        return self.redis.get(key)