import os
import random
import time

from dotenv import load_dotenv
from google import genai
from google.genai import errors

load_dotenv()
client = genai.Client()

MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")

def generate_answer(prompt: str, retries: int = 4) -> str:
    last_error = None

    for attempt in range(retries):
        try:
            response = client.models.generate_content(model=MODEL, contents=prompt)
            if response.text:
                return response.text
            raise RuntimeError("Model returned an empty response")

        except errors.ServerError as e:
            last_error = e

        except errors.ClientError as e:
            last_error = e
            if e.code != 429:
                raise RuntimeError(f"Gemini request failed: {e}") from e

        if attempt < retries - 1:
            time.sleep(2 ** attempt + random.random())

    raise RuntimeError(f"LLM busy, please try again later. ({last_error})")