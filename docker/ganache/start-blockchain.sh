#!/bin/sh

N_ACCOUNTS="${ACCOUNTS_NUMBER:-10}"
ETHER="${ACCOUNTS_ETHER:-1000}"
MNEMONIC="${MNEMONIC:-"myth like bonus scare over problem client lizard pioneer submit female collect"}"
HOST="${HOST:-"0.0.0.0"}"
PORT="${PORT:-8545}"
ID="${NETWORK_ID:-5778}"

node /app/ganache-core.docker.cli.js \
  -a "$N_ACCOUNTS" \
  -e "$ETHER" \
  -m "$MNEMONIC" \
  -h "$HOST" \
  -p "$PORT" \
  -i "$ID" \
  --account_keys_path "/home/ganache_keys/keys.json" \
  --db "/home/ganache_db/" \
  --allowUnlimitedContractSize \
  --noVMErrorsOnRPCResponse \
  -d \
  -v
