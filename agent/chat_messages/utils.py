from chat_messages.models import ChatParticipant
from django.contrib.auth import get_user_model

from agent.users.constants import SYSTEM_USER_ID

from .models import Chat


def add_participant_to_chat(chat, user):
    participant = ChatParticipant(chat=chat, user=user)
    participant.save()
    return participant


def add_ai_bot_to_chat(chat):
    User = get_user_model()
    system_user = User.objects.get(pk=SYSTEM_USER_ID)

    participant = ChatParticipant(chat=chat, user=system_user)
    participant.save()
    return participant


def create_chat(name, user):
    chat = Chat.objects.create(name=name)
    add_participant_to_chat(chat, user)
    add_ai_bot_to_chat(chat)
    return chat
