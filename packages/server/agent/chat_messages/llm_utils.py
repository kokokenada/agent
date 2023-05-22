import json
import os
import uuid

import websocket

# from django_eventstream import send_event
from langchain.llms import OpenAI

from agent.chat_messages.consumers import ChatConsumer

from .utils import get_system_user, write_message

llm = OpenAI(temperature=0.9)


def generate_response(chat_id, message):
    print(f"Generating response... {message} key={os.environ.get('OPENAI_API_KEY')}")
    try:
        resp = llm(message)
        print(f"Response: {resp}")
        # send_event("test", "message", {"text": "hello world"})

        write_message(uuid.uuid4(), get_system_user(), chat_id, resp)

        send_message(chat_id, resp)

        return resp
    except Exception as e:
        print(f"Error: {e}")
        return "Sorry, I didn't understand that."


def send_message(chat_id, message):
    ws = websocket.WebSocket()
    ws.connect(f"ws://localhost:8000/ws/chat/{chat_id}/")
    ws.send(json.dumps({"message": message}))
    ws.close()
