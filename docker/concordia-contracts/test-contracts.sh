#!/bin/sh

export CHAIN_HOST="$TEST_CHAIN_HOST"
export CHAIN_PORT="$TEST_CHAIN_PORT"

yarn _eslint -f html -o /mnt/concordia/test-reports/concordia-contracts-eslint.html --no-color
ESLINT_EXIT_STATUS=$?

yarn _solhint >/mnt/concordia/test-reports/concordia-contracts-solhint.report
SOLHINT_EXIT_STATUS=$?

yarn test --network env >/mnt/concordia/test-reports/concordia-contracts-truffle-tests.report
grep -qE failing /mnt/concordia/test-reports/concordia-contracts-truffle-tests.report
TRUFFLE_TEST_FAILING=$?

if [ $ESLINT_EXIT_STATUS -eq 0 ] && [ "$SOLHINT_EXIT_STATUS" -eq 0 ] && [ "$TRUFFLE_TEST_FAILING" -eq 1 ]; then
  echo "TESTS RAN SUCCESSFULLY!"
  exit 0
else
  echo "SOME TESTS FAILED!"
  exit 1
fi
