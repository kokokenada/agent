import graphene
import graphql_jwt
from django.contrib.auth import authenticate, get_user_model, login
from django.db import models
from django.http import HttpResponse

from config.settings.base import JWT_AUTH


class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
