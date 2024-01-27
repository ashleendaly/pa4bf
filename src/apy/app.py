import io
from src.apy.instance import redis_repo
from fastapi import FastAPI, Request, Response

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
    image_data = request.app.state.redis_repo.get_image(hash)
    return Response(content=image_data, media_type="image/jpeg")


@app.get("/apy/search")
async def search(search_query, request: Request):
    return request.app.state.redis_repo.vector_search(search_query)