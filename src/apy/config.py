import os
from os.path import abspath, join
from dotenv import load_dotenv

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
ENV = join(ROOT_DIR, '../../.env')
load_dotenv(ENV)

REDIS_HOST = os.environ.get("REDIS_HOST")
REDIS_PORT = os.environ.get("REDIS_PORT")
REDIS_PASSWORD = os.environ.get("REDIS_PASSWORD")

BEAMS_INSTANCE_ID = os.environ.get("NEXT_PUBLIC_BEAMS_INSTANCE_ID")
BEAMS_SECRET_KEY = os.environ.get("NEXT_PUBLIC_BEAMS_SECRET_KEY")