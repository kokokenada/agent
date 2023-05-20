import graphene
from django.contrib.auth import get_user_model
from graphene import Node
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from .models import Chat as DbChat
from .models import ChatMessage as DbChatMessage
from .models import ChatParticipant as DbChatParticipant
from .utils import apply_pagination, create_chat, get_my_chats

User = get_user_model()


class Chat(DjangoObjectType):
    # Describe the data that is to be formatted into GraphQL fields
    class Meta:
        model = DbChat
        field = ("id", "name")


class CreateChatMutation(graphene.Mutation):
    class Arguments:
        # Add fields you would like to create. This will corelate with the ContactType fields above.
        name = graphene.String()

    chat = graphene.Field(Chat)  # define the class we are getting the fields from

    @classmethod
    def mutate(cls, root, info, name):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Authentication required")

        chat = create_chat(name, user)
        return CreateChatMutation(chat=chat)


class ChatMessage(DjangoObjectType):
    class Meta:
        model = DbChatMessage
        interfaces = (Node,)
        fields = ("id", "content", "sender_user", "created_at")
        filter_fields = ["id", "chat"]
        order_by = ["created_at"]


class Query(graphene.ObjectType):
    my_chats = graphene.List(Chat)
    chat_messages = DjangoFilterConnectionField(ChatMessage, chat_id=graphene.ID(required=True))

    def resolve_my_chats(self, info):
        user = info.context.user
        return get_my_chats(user)

    def resolve_chat_messages(self, info, chat_id, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Authentication required")

        # Get the chat object from the database
        chat = DbChat.objects.filter(participants__user=user, id=chat_id).first()

        if not chat:
            raise Exception("Chat not found")

        # Get the chat messages for the chat
        chat_messages = DbChatMessage.objects.filter(chat_id=chat.id)

        # Apply pagination to the chat messages
        return chat_messages  # apply_pagination(chat_messages, kwargs)


class CreateChatMessageMutation(graphene.Mutation):
    chat_message = graphene.Field(ChatMessage)

    class Arguments:
        chat_id = graphene.ID(required=True)
        content = graphene.String(required=True)

    def mutate(self, info, chat_id, content):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Authentication required")

        chat = DbChat.objects.get(id=chat_id)
        chat_participant = DbChatParticipant.objects.get(chat_id=chat_id, user_id=user.id)
        print(chat_participant)
        if not chat_participant:
            raise Exception("Not authorized to send messages in this chat")

        chat_message = DbChatMessage(chat=chat, sender_user=user, content=content)
        chat_message.save()

        return CreateChatMessageMutation(chat_message=chat_message)


class Mutation(graphene.ObjectType):
    create_chat = CreateChatMutation.Field()
    create_chat_message = CreateChatMessageMutation.Field()
