#!/bin/bash

REMOTE_HOST="192.168.100.102"
REMOTE_USER="rudix"
REMOTE_PATH="/home/rudix/Desktop/.monorepo/news/_next"

next build --turbo

ssh "${REMOTE_USER}@${REMOTE_HOST}" "sudo rm -rf ${REMOTE_PATH} && \
                                   sudo mkdir -p ${REMOTE_PATH} && \
                                   sudo chown -R ${REMOTE_USER}:${REMOTE_USER} ${REMOTE_PATH} && \
                                   sudo chmod -R u+rwx ${REMOTE_PATH}"
STATUS=$?
if [ $STATUS -ne 0 ]; then
    echo "ERROR: Remote directory setup failed."
    exit 1
fi

rsync -avzP --rsync-path="sudo rsync" .next/ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}"
STATUS=$?

if [ $STATUS -eq 0 ]; then
    echo "Deployment successful!"
else
    echo "ERROR: Rsync deployment failed."
    exit 1
fi

ssh "${REMOTE_USER}@${REMOTE_HOST}" "sudo docker restart renewz"
