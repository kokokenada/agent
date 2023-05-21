from chat_messages.models import ChatParticipant
from django.contrib.auth import get_user_model
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator

from agent.users.constants import SYSTEM_USER_ID

from .models import Chat, ChatMessage


def get_system_user():
    User = get_user_model()
    system_user = User.objects.get(pk=SYSTEM_USER_ID)
    return system_user


def add_participant_to_chat(chat, user):
    participant = ChatParticipant(chat=chat, user=user)
    participant.save()
    return participant


def add_ai_bot_to_chat(chat):
    system_user = get_system_user()

    participant = ChatParticipant(chat=chat, user=system_user)
    participant.save()
    return participant


def create_chat(name, user):
    chat = Chat.objects.create(name=name)
    add_participant_to_chat(chat, user)
    add_ai_bot_to_chat(chat)
    return chat


def get_my_chats(user):
    if user.is_anonymous:
        raise Exception("Authentication required")

    chats = Chat.objects.filter(participants__user=user).distinct()
    return chats


def write_message(user, chat_id, content):
    if user.is_anonymous:
        raise Exception("Authentication required")

    chat = Chat.objects.get(id=chat_id)
    chat_participant = ChatParticipant.objects.get(chat_id=chat_id, user_id=user.id)
    print(chat_participant)
    if not chat_participant:
        raise Exception("Not authorized to send messages in this chat")

    chat_message = ChatMessage(chat=chat, sender_user=user, content=content)
    chat_message.save()
    return chat_message


def apply_pagination(queryset, kwargs):
    paginator = Paginator(queryset, kwargs.get("first", 10))
    page = kwargs.get("page", 1)

    try:
        items = paginator.page(page)
    except PageNotAnInteger:
        items = paginator.page(1)
    except EmptyPage:
        items = paginator.page(paginator.num_pages)

    return items
