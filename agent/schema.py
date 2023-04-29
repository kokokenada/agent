import chat_messages.schema
import graphene


class Query(graphene.ObjectType):
    hello = graphene.String(default_value="Hi!")


class Mutation(chat_messages.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
