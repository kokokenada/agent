import graphene
import graphql_jwt
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.db import models
from django.http import HttpResponse
from graphene_django import DjangoObjectType

from agent.users.models import User as DbUser
from config.settings.base import JWT_AUTH

from .constants import SYSTEM_USER_ID


class User(DjangoObjectType):
    isAI = graphene.Boolean()

    class Meta:
        model = DbUser
        fields = ("id", "name", "email", "isAI")

    def resolve_isAI(self, info):
        print("resolve_isAI called")
        print(f"self={self} self.id={self.id} SYSTEM_USER_ID={SYSTEM_USER_ID}")
        return self.id == SYSTEM_USER_ID


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
