#!/bin/sh

N_ACCOUNTS="${ACCOUNTS_NUMBER:-10}"
ETHER="${ACCOUNTS_ETHER:-10}"
HOST="${HOST:-"0.0.0.0"}"
PORT="${PORT:-8545}"
ID="${NETWORK_ID:-5778}"

if [ -z "${MNEMONIC}" ]; then
  echo "Starting Ganache with non deterministic address generation"
  node /app/ganache-core.docker.cli.js \
    --accounts "$N_ACCOUNTS" \
    --defaultBalanceEther "$ETHER" \
    --host "$HOST" \
    --port "$PORT" \
    --networkId "$ID" \
    --account_keys_path "/home/ganache_keys/keys.json" \
    --db "/home/ganache_db/" \
    --allowUnlimitedContractSize \
    --noVMErrorsOnRPCResponse \
    --verbose
else
  echo "Starting Ganache with deterministic address generation"
  node /app/ganache-core.docker.cli.js \
    --accounts "$N_ACCOUNTS" \
    --defaultBalanceEther "$ETHER" \
    --mnemonic "$MNEMONIC" \
    --host "$HOST" \
    --port "$PORT" \
    --networkId "$ID" \
    --account_keys_path "/home/ganache_keys/keys.json" \
    --db "/home/ganache_db/" \
    --allowUnlimitedContractSize \
    --noVMErrorsOnRPCResponse \
    --deterministic \
    --verbose
fi
