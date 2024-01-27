from fastapi import FastAPI, Request, Response
import json
from src.apy.instance import redis_repo

app = FastAPI()

app.state.redis_repo = redis_repo

@app.get("/apy")
def hello_world():
    return {"message": "Hello World"}

@app.get("/apy/upload")
async def upload(image_url, request: Request):
    return request.app.state.redis_repo.upload_image(image_url)
    
@app.get("/apy/download")
async def download(hash, request: Request):
    return request.app.state.redis_repo.get_image(hash)

@app.get("/apy/search")
async def search(search_query, request: Request):
    return request.app.state.redis_repo.vector_search(search_query)