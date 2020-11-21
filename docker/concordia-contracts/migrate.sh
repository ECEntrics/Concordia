#!/bin/sh

cd /usr/src/concordia/packages/concordia-contracts && yarn _migrate --network "${MIGRATE_NETWORK}"
