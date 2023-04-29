import graphene
from chat_messages.schema import ChatCreate


class Query(graphene.ObjectType):
    hello = graphene.String(default_value="Hi!")


class Mutation(graphene.ObjectType):
    chat_create = ChatCreate.Field()


# schema = graphene.Schema(query=Query)
schema = graphene.Schema(query=Query, mutation=Mutation)
