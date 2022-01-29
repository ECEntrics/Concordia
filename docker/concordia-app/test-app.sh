#!/bin/sh

yarn lint -f html -o /mnt/concordia/test-reports/concordia-app-eslint.html --no-color

if [ $? -eq 0 ]; then
  echo "TESTS RAN SUCCESSFULLY!"
  exit 0
else
  echo "SOME TESTS FAILED!"
  exit 1
fi
