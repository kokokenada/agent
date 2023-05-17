#!/bin/bash

source activate_and_set_env.sh
cd packages/server
python manage.py migrate
python manage.py createsuperuser
