from fastapi import FastAPI, Request, Response
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
async def upload(hash, request: Request):
    image_data =  request.app.state.redis_repo.get_image(hash)
    if image_data:
        return Response(content=image_data, media_type="image/jpeg")
    else:
        return {"error": "Image not found"}