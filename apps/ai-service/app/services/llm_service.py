import os
import random
import time

from dotenv import load_dotenv
from google import genai
from google.genai import errors

load_dotenv()
client = genai.Client()

MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")


def generate_answer(prompt: str, retries: int = 5) -> str:
    last_error = None

    for attempt in range(retries):
        try:
            response = client.models.generate_content(
                model=MODEL,
                contents=prompt,
            )
            return response.text or ""

        except errors.ServerError as e:
            # 500/503: model overloaded, back off and retry
            last_error = e

        except errors.ClientError as e:
            last_error = e
            if e.code != 429:
                # 404, 400, 403 etc. won't fix themselves, fail fast
                raise RuntimeError(f"Gemini request failed: {e}") from e

        # Exponential backoff with jitter: ~1s, 2s, 4s, 8s, 16s
        time.sleep(2 ** attempt + random.random())

    raise RuntimeError(f"LLM busy, please try again later. ({last_error})")