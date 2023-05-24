"""
ASGI config for agent project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/dev/howto/deployment/asgi/

"""
import os
import sys
from pathlib import Path

# import django_eventstream
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from django.urls import path, re_path

from agent.chat_messages.routing import websocket_urlpatterns

# This allows easy placement of apps within the interior
# agent directory.
BASE_DIR = Path(__file__).resolve(strict=True).parent.parent
sys.path.append(str(BASE_DIR / "agent"))

# If DJANGO_SETTINGS_MODULE is unset, default to the local settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")

# This application object is used by any ASGI server configured to use this file.
django_application = get_asgi_application()
# Apply ASGI middleware here.
# from helloworld.asgi import HelloWorldApplication
# application = HelloWorldApplication(application)

# Import websocket application here, so apps from django_application are loaded first
from config.websocket import websocket_application  # noqa isort:skip


# async def application(scope, receive, send):
#     if scope["type"] == "http":
#         await django_application(scope, receive, send)
#     elif scope["type"] == "websocket":
#         await websocket_application(scope, receive, send)
#     else:
#         raise NotImplementedError(f"Unknown scope type {scope['type']}")
application = ProtocolTypeRouter(
    {
        "http": URLRouter(
            [
                # path(
                #     "events/",
                #     AuthMiddlewareStack(URLRouter(django_eventstream.routing.urlpatterns)),
                #     {"channels": ["test"]},
                # ),
                re_path(r"", django_application),
            ]
        ),
        "websocket": AllowedHostsOriginValidator(AuthMiddlewareStack(URLRouter(websocket_urlpatterns))),
    }
)
