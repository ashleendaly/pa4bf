import io
from src.apy.instance import redis_repo, beams_repo
from fastapi import FastAPI, Request, Response
from pydantic import BaseModel

class ReqData(BaseModel):
    image_url: str
    group_id: int

app = FastAPI()

app.state.redis_repo = redis_repo
app.state.beams_repo = beams_repo

@app.get("/apy")
def hello_world():
    return {"message": "Hello World"}

@app.post("/apy/upload")
async def upload(data: ReqData, request: Request):
    return request.app.state.redis_repo.upload_image(data.image_url,data.group_id)
    
@app.get("/apy/download")
async def download(hash, group_id, request: Request):
    image_data = request.app.state.redis_repo.get_image(hash)
    return Response(content=image_data, media_type="image/jpeg")


@app.get("/apy/search")
async def search(search_query, group_id, request: Request):
    return request.app.state.redis_repo.vector_search(search_query, group_id)

@app.post("/apy/notification")
async def send_notification(request: Request):
    return request.app.state.beams_repo.send_notification()

