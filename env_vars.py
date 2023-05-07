import argparse
import os
import subprocess

parser = argparse.ArgumentParser(description="Environment Variables Setter Program")
parser.add_argument(
    "--env",
    dest="environment",
    type=str,
    default="local",
    help='the environment to use "local" or "cloud" (default: local)',
)

args = parser.parse_args()

environment = args.environment

if environment != "local" and environment != "cloud":
    raise ValueError("The environment must be either 'local' or 'cloud'.")


class EnvironmentError(Exception):
    """Exception raised for errors related to the environment.

    Attributes:
        message -- explanation of the error
    """

    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


def get_active_git_branch():
    try:
        branch_name = (
            subprocess.check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"])
            .decode("utf-8")
            .strip()
        )
        return branch_name
    except subprocess.CalledProcessError:
        raise OSError("Unable to determine the active Git branch.")


active_branch = get_active_git_branch()
if not active_branch:
    raise OSError("Unable to determine the active Git branch.")


venv = os.environ["VIRTUAL_ENV"]

if environment == "local" and (active_branch == "develop" or active_branch == "master"):
    raise OSError(
        f"environment=local but the active branch is ({active_branch}) which is expected to run in the cloud."
    )

print(f"export VIRTUAL_ENV={venv}")
print(f"export GIT_BRANCH={active_branch}")
print(f"export ENVIRONMENT={environment}")
if active_branch == "master":
    print("export DJANGO_SETTINGS_MODULE=config.settings.production")
    print("export VITE_API_URL=https://api.agent.todo.deplyment.url.here.com")
elif active_branch == "develop":
    print("export DJANGO_SETTINGS_MODULE=config.settings.development")
    print("export VITE_API_URL=https://api.agent.todo.deplyment.url.here.com")
if environment == "local":
    print("export DJANGO_SETTINGS_MODULE=config.settings.local")
    print("export VITE_API_URL=http://localhost:8000/graphql")
