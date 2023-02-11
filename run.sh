#!/bin/bash

#Set up python
pip3 install -r sentiment/requirements.txt

python3 sentiment/server.py &

#setup node
(cd slack && npm i )

node slack/index.js

