import graphene
from graphene_django import DjangoObjectType

from .models import Chat
from .utils import create_chat


class ChatType(DjangoObjectType):
    # Describe the data that is to be formatted into GraphQL fields
    class Meta:
        model = Chat
        field = ("id", "name")


class ChatCreateMutation(graphene.Mutation):
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
        return ChatCreateMutation(chat=chat)


class Mutation(graphene.ObjectType):
    chat_create = ChatCreateMutation.Field()
