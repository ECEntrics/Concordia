#!/bin/sh

export CHAIN_HOST="$DEPLOY_CHAIN_HOST"
export CHAIN_PORT="$DEPLOY_CHAIN_PORT"

cd /usr/src/concordia/packages/concordia-contracts && yarn _migrate --network "${MIGRATE_NETWORK}" --reset
