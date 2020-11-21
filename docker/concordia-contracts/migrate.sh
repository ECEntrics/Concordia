#!/bin/sh

if [ -z "${SKIP_MIGRATE}" ]; then
  cd /usr/src/concordia/packages/concordia-contracts && yarn migrate --network develop
else
  echo "Skipping migration..."
fi
