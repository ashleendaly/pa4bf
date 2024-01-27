from fastapi import FastAPI
from routers.redis import router as redis_router

app = FastAPI()

app.include_router(redis_router)

@app.get("/apy/python")
def hello_world():
    return {"message": "Hello World"}

