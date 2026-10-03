from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client()

def generate_answer(prompt : str):
    response = client.models.generate_content(
        model="gemini-3.8-flash",
        contents=prompt
    )
    return response.text