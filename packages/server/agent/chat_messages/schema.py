import graphene
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType

from .models import Chat, ChatMessage
from .utils import create_chat, get_my_chats

User = get_user_model()


class ChatType(DjangoObjectType):
    # Describe the data that is to be formatted into GraphQL fields
    class Meta:
        model = Chat
        field = ("id", "name")


class CreateChatMutation(graphene.Mutation):
    class Arguments:
        # Add fields you would like to create. This will corelate with the ContactType fields above.
        name = graphene.String()

    chat = graphene.Field(ChatType)  # define the class we are getting the fields from

    @classmethod
    def mutate(cls, root, info, name):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Authentication required")

        chat = create_chat(name, user)
        return CreateChatMutation(chat=chat)


class ChatMessageType(DjangoObjectType):
    class Meta:
        model = ChatMessage


class Query(graphene.ObjectType):
    my_chats = graphene.List(ChatType)

    def resolve_my_chats(self, info):
        user = info.context.user
        return get_my_chats(user)
        # print(user)
        # if user.is_anonymous:
        #     raise Exception("Authentication required")
        # print("here1")
        # chats = Chat.objects.filter()
        # # chats = Chat.objects.all()
        # print(chats)
        # print("here2")
        # return chats


class CreateChatMessageMutation(graphene.Mutation):
    chat_message = graphene.Field(ChatMessageType)

    class Arguments:
        chat_id = graphene.ID(required=True)
        content = graphene.String(required=True)

    def mutate(self, info, chat_id, content):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Authentication required")

        chat = Chat.objects.get(id=chat_id)

        if user not in chat.participants.all():
            raise Exception("Not authorized to send messages in this chat")

        chat_message = ChatMessage(chat=chat, sender=user, content=content)
        chat_message.save()

        return CreateChatMessageMutation(chat_message=chat_message)


class Mutation(graphene.ObjectType):
    create_chat = CreateChatMutation.Field()
    create_chat_message = CreateChatMessageMutation.Field()
