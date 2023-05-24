#!/bin/bash
# Run from dir above project root
rm -rf venv
python3 -m venv venv
source venv/bin/activate
cd agent
pip install -r packages/server/requirements/local.txt
