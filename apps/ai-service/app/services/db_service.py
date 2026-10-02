import os
import psycopg
from dotenv import load_dotenv
from pgvector.psycopg import register_vector

load_dotenv()

def get_connection():
    print("heloo")
    connection = psycopg.connect(
        os.environ["DATABASE_URL"]
    )
    register_vector(connection)
    
    return connection