import os
import uuid

# from django_eventstream import send_event
from langchain.llms import OpenAI

from .utils import get_system_user, write_message

llm = OpenAI(temperature=0.9)


def generate_response(chat_id, message):
    print(f"Generating response... {message} key={os.environ.get('OPENAI_API_KEY')}")
    try:
        resp = llm(message)
        print(f"Response: {resp}")
        # send_event("test", "message", {"text": "hello world"})

        write_message(uuid.uuid4(), get_system_user(), chat_id, resp)
        return resp
    except Exception as e:
        print(f"Error: {e}")
        return "Sorry, I didn't understand that."
