import graphene
import graphql_jwt
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.db import models
from django.http import HttpResponse

from config.settings.base import JWT_AUTH


class LogoutMutation(graphene.Mutation):
    success = graphene.Boolean()

    def mutate(self, info):
        logout(info.context)
        return LogoutMutation()


class Mutation(graphene.ObjectType):
    logout = LogoutMutation().Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
