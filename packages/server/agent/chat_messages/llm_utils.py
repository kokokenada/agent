import json
import os
import uuid

import websocket
from langchain.chat_models import ChatOpenAI

# from django_eventstream import send_event
from langchain.llms import OpenAI
from langchain.prompts.chat import ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate

from agent.chat_messages.consumers import ChatConsumer

from .utils import get_system_user, write_message

llm = OpenAI(temperature=0.9)
chat = ChatOpenAI(temperature=0.9)

USE_CHAT = True

template = "You are a helpful assistant that answers like {answer_as}."
system_message_prompt = SystemMessagePromptTemplate.from_template(template)
human_template = "{text}"
human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)

chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])


def generate_response(chat_id, message, answer_as=None):
    print(f"Generating response... {message} key={os.environ.get('OPENAI_API_KEY')}")
    try:
        resp = ""
        if USE_CHAT:
            resp = chat(
                chat_prompt.format_prompt(
                    text=message, answer_as=answer_as or "a helpful and friendly bot"
                ).to_messages()
            ).content
        else:
            resp = llm(message)
        print(f"Response: {resp}")

        message_id = uuid.uuid4()

        write_message(message_id, get_system_user(), chat_id, resp)

        send_message(message_id, chat_id, resp)

        return resp
    except Exception as e:
        print(f"Error: {e}")
        return "Sorry, I didn't understand that."


def send_message(message_id, chat_id, message):
    ws = websocket.WebSocket()
    ws.connect(f"ws://localhost:8000/ws/chat/{chat_id}/")
    payload = json.dumps({"message": {"message": message, "chat_id": str(chat_id), "message_id": str(message_id)}})
    print(f"Sending message: {payload} to chat_id={chat_id} message_id={message_id}")
    ws.send(payload)
    ws.close()
