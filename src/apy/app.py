from fastapi import FastAPI

app = FastAPI()

@app.get("/apy/python")
def hello_world():
    return {"message": "Hello World"}