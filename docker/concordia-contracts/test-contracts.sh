#!/bin/sh

yarn _eslint -f html -o /usr/test-reports/concordia-contracts-eslint.html --no-color &&
  (yarn _solhint >/usr/test-reports/concordia-contracts-solhint.report) &&
  (yarn test >/usr/test-reports/concordia-contracts-truffle-tests.report)

if [ $? -eq 0 ]; then
  # Tests ran successfully
  if [ -n "${CI}" ]; then
    # This is a ci run
    # Create a pass file to alert the ci about test success
    # mkdir /usr/test-results && touch /usr/test-results/pass
    exit 0
  fi
else
  echo "SOME TESTS FAILED!"
  exit 1
fi
