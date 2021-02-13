#!/bin/sh

export CHAIN_HOST="$TEST_CHAIN_HOST"
export CHAIN_PORT="$TEST_CHAIN_PORT"

yarn _eslint -f html -o /mnt/concordia/test-reports/concordia-contracts-eslint.html --no-color &&
  (yarn _solhint >/mnt/concordia/test-reports/concordia-contracts-solhint.report) &&
  (yarn test --network env >/mnt/concordia/test-reports/concordia-contracts-truffle-tests.report)

if [ $? -eq 0 ]; then
  echo "TESTS RAN SUCCESSFULLY!"
  exit 0
else
  echo "SOME TESTS FAILED!"
  exit 1
fi
