# Django, Graphql, LangChain Starter

A starter custom chat interface with a React front end and LangChain / Python backend.

## Demo

https://static/demo.mp4



## Stack

* Django app for user management, seeded with [Django Cookie Cutter](https://cookiecutter-django.readthedocs.io/)
* LangChain
* React/Mui/Vite/ChatScope (https://chatscope.io/) for dynamic chat client
* GraphQL API
* WebSockets for streaming (see notes)

## Notes

* Exploratory project.  First time at using Django and Python, so a bit of a school project
* Plan A was to use SSE, not sockets, but I ran into problems with the dependencies (https://github.com/fanout/django-eventstream/issues/100). Tooling for sockets seemed more stable, so shifted to that, even though it is overkill (since a GraphQL mutation sends a message to the bot, there is only a one way stream from server to client required for bot response)
* Unfinished, maintenance doubtful
* Sharing in case it's helpful

## Running
* Try sh scripts in root for set up
* VSCode tasks (DevEnv - launches most of what's needed)
* CICD and cloud deployment, not done yet
