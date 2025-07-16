#!/bin/bash
set -e

# Sync the standalone build files to the remote server
cp ./server.js ./.next/
rsync -avz --delete .next/ rudix@bee.local:/home/rudix/Desktop/.monext/renewz/


echo "Deployment successful!"
