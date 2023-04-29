import graphene
from graphene_django import DjangoObjectType

from .models import Chat


class ChatType(DjangoObjectType):
    # Describe the data that is to be formatted into GraphQL fields
    class Meta:
        model = Chat
        field = ("id", "name")
        # app_label = 'chat_messages'


class ChatCreate(graphene.Mutation):
    class Arguments:
        # Add fields you would like to create. This will corelate with the ContactType fields above.
        name = graphene.String()

    chat = graphene.Field(ChatType)  # define the class we are getting the fields from

    @classmethod
    def mutate(cls, root, info, name):
        # function that will save the data
        chat = Chat(name=name)  # accepts all fields
        chat.save()  # d=save the contact
