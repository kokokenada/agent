#!/bin/bash

source activate_and_set_env.sh
cd .. ## go to root
# something like this but more selective, consider rolling back migrations of application
# find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
# find . -path "*/migrations/*.pyc"  -delete
# restore files that are in git but nuked
# to do - nuke db
# nuke and rebuild environment
./agent/init-env.sh

# init db
cd agent
source ./init-db.sh
