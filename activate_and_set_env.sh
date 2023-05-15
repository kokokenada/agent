#!/bin/bash

# Activate the virtual environment
source ../venv/bin/activate

# Run the set_env_vars.py script to set environment variables
#!/bin/bash
# csa set-env healix-dev api local_direct # Uncomment to debug
python env_vars.py
eval `python env_vars.py`
