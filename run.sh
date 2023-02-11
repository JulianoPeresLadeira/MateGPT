#!/bin/bash

sudo kill -9 $(sudo netstat -tlpn | grep -i 5000 |  awk '{print $7}'  | sed 's/\/python3//g' )

#Set up python
pip3 install -r sentiment/requirements.txt

python3 sentiment/server.py &

#setup node
(cd slack && npm i )

node slack/index.js

