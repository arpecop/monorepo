#!/bin/bash
set -e

# Sync the standalone build files to the remote server
cp ./server.js ./.next/
rsync -avz --delete .next/ rudix@192.168.100.102:/home/rudix/Desktop/monorepo/renewz/


echo "Deployment successful!"
