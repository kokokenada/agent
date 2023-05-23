import graphene
from django.contrib.auth import get_user_model
from graphene import Node, SimpleGlobalIDType
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from agent.users.schema import User

from .llm_utils import generate_response
from .models import Chat as DbChat
from .models import ChatMessage as DbChatMessage
from .models import ChatParticipant as DbChatParticipant
from .utils import apply_pagination, create_chat, get_my_chats, write_message


class CustomNode(Node):
    class Meta:
        global_id_type = SimpleGlobalIDType


class ChatParticipant(DjangoObjectType):
    user = graphene.Field(User)

    class Meta:
        model = DbChatParticipant
        fields = ("id", "chat", "user", "created_at")


class Chat(DjangoObjectType):
    last_message = graphene.Field("chat_messages.schema.ChatMessage")

    class Meta:
        model = DbChat
        field = ("id", "name", "last_message")

    def resolve_last_message(self, info):
        return DbChatMessage.objects.filter(chat_id=self.id).order_by("-created_at").first()


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
    sender_user = graphene.Field(User)

    class Meta:
        model = DbChatMessage
        interfaces = (CustomNode,)
        fields = ("id", "content", "sender_user", "created_at")
        filter_fields = ["id", "chat"]
        order_by = ["created_at"]
        # global_id_type = SimpleGlobalIDType


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
        id = graphene.ID(required=True)
        chat_id = graphene.ID(required=True)
        content = graphene.String(required=True)
        answer_as = graphene.String(required=False)

    def mutate(self, info, id, chat_id, content, answer_as=None):
        user = info.context.user
        chat_message = write_message(id, user, chat_id, content)

        generate_response(chat_id, content, answer_as)

        return CreateChatMessageMutation(chat_message=chat_message)


class Mutation(graphene.ObjectType):
    create_chat = CreateChatMutation.Field()
    create_chat_message = CreateChatMessageMutation.Field()
