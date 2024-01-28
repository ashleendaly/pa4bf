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

    def upload_image(self, image_url, group_id):
        response = requests.get(image_url)
        image_data = io.BytesIO(response.content)
        image_key = hashlib.md5(image_url.encode()).hexdigest()
        self.redis.hset(group_id, image_key, image_data.read())
        return image_key

    def get_image(self, hash, group_id):
        return self.redis.hget(group_id, f"{hash}")

    def vector_search(self, search_query, group_id):
        hashes = self.redis.hkeys(group_id)
        images = []
        text_emb = self.transformer.encode(search_query)
        for hash in hashes:
            decoded_hash = hash.decode("utf-8")
            image_bytes = self.get_image(decoded_hash)
            image = Image.open(io.BytesIO(image_bytes))
            images.append(image)

        image_embs = self.transformer.encode(images)

        scores_disct = {}
        cos_scores = util.cos_sim(image_embs, text_emb)
        
        for i, score in enumerate(cos_scores):
            scores_disct[hashes[i]] = float(score[0])
            
        return scores_disct
