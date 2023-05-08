import graphene
import graphql_jwt
from django.contrib.auth import authenticate, get_user_model, login
from django.db import models
from graphene_django import DjangoObjectType


class LoginResponse(graphene.ObjectType):
    token = graphene.String()


# class LoginMutation(graphene.Mutation):
#     class Arguments:
#         user_name = graphene.String()
#         password = graphene.String()

#     Output = LoginResponse

#     @classmethod
#     def mutate(cls, root, info, user_name, password):
#         # You should implement the authentication logic here,
#         # and generate the token for the user if the credentials are valid.
#         # For now, I'm just returning a hardcoded token.
#         token = "your_generated_token"
#         return LoginResponse(token=token)

# class Mutation(graphene.ObjectType):
#     login = LoginMutation.Field()


class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
