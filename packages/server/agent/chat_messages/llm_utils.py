import base64
import json
import os
import uuid
from enum import Enum
from typing import Any, Union

import websocket
from langchain.callbacks.base import BaseCallbackHandler
from langchain.chat_models import ChatOpenAI
from langchain.llms import OpenAI
from langchain.prompts.chat import ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate

from agent.chat_messages.consumers import ChatConsumer

from .utils import get_system_user, write_message

# from django_eventstream import send_event


class ChatNotificationEnum(Enum):  # Sync with frontend
    COMPLETE_RESPONSE = 1
    PARTIAL_RESPONSE = 2
    ERROR = 3
    INFO = 4


USE_CHAT = True
DEBUG = True

template = "You are a helpful assistant that answers like {answer_as}."
system_message_prompt = SystemMessagePromptTemplate.from_template(template)
human_template = "{text}"
human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)

chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])


class MyCustomHandler(BaseCallbackHandler):
    def __init__(self, chat_id, ws, message_id):
        self.chat_id = chat_id
        self.ws = ws
        self.message_id = message_id

    def on_llm_new_token(self, token: str, **kwargs) -> None:
        if DEBUG:
            print(f"My custom handler, token: {token}")
        send_message(self.ws, self.message_id, self.chat_id, token, ChatNotificationEnum.PARTIAL_RESPONSE.value)

    def on_llm_error(self, error: Exception | KeyboardInterrupt, **kwargs: Any) -> Any:
        """Run when LLM errors."""
        print(f"My custom handler, error: {error}")

    def on_text(self, text: str, **kwargs: Any) -> Any:
        """Run on arbitrary text."""
        print(f"My custom handler, text: {text}")


def generate_response(chat_id, message, answer_as=None):
    print(f"Generating response... {message} key={os.environ.get('OPENAI_API_KEY')}")
    try:
        message_id = uuid.uuid4()
        ws = websocket.WebSocket()
        ws.connect(f"ws://localhost:8000/ws/chat/{chat_id}/")
        resp = ""
        if USE_CHAT:
            chat = ChatOpenAI(
                temperature=0.9,
                streaming=True,
                callbacks=[MyCustomHandler(chat_id=chat_id, ws=ws, message_id=message_id)],
            )
            resp = chat(
                chat_prompt.format_prompt(
                    text=message, answer_as=answer_as or "a helpful and friendly bot"
                ).to_messages()
            ).content
        else:
            llm = OpenAI(
                temperature=0.9,
                streaming=True,
                callbacks=[MyCustomHandler(chat_id=chat_id, ws=ws, message_id=message_id)],
            )
            resp = llm(message)
        if DEBUG:
            print(f"Response: {resp}")

        write_message(message_id, get_system_user(), chat_id, resp)

        send_message(ws, message_id, chat_id, resp, ChatNotificationEnum.COMPLETE_RESPONSE.value)

        ws.close()
        return resp
    except Exception as e:
        print(f"Error: {e}")
        return "Sorry, I didn't understand that."


def send_message(ws, message_id, chat_id, message, type):
    payload = json.dumps(
        {"message": {"message": message, "chat_id": str(chat_id), "message_id": str(message_id), "type": type}}
    )
    if DEBUG:
        print(f"Sending message: {payload} to chat_id={chat_id} message_id={message_id}")
    resp = ws.send(payload)
    if DEBUG:
        print(f"Response: {resp}")
