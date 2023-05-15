import chat_messages.schema
import graphene
import users.schema


class Query(chat_messages.schema.Query, graphene.ObjectType):
    # hello = graphene.String(default_value="Hi!")
    pass


class Mutation(chat_messages.schema.Mutation, users.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
