from sentence_transformers import SentenceTransformer, util
from PIL import Image
import io
import numpy as np
import redis
import hashlib
import requests

class RedisRepository:

    def __init__(self, host, port, password):
        self.redis = redis.Redis(host=host, port=port, password=password)
        self.transformer = SentenceTransformer('clip-ViT-B-32')

    def upload_image(self, image_url):
        response = requests.get(image_url)
        image_data = Image.open(response.content)
        image_key = hashlib.md5(image_url.encode()).hexdigest()
        
        self.redis.hset("key", image_key, image_data)
        return {"key": image_key, "data": image_data}

    def get_image(self):
        return self.redis.get("key")

    def vector_search(self, search_query):
        return self.redis.get("key")
        text_emb = self.transformer.encode(search_query)

        # cos_scores = util.cos_sim(np.array(image_vectors.values())., text_emb)[0]
        # return cos_scores
