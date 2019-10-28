#!/bin/bash

# Migrates contracts
rm -f /usr/apella/app/src/contracts/*
cd /usr/apella/
truffle migrate

cd /usr/apella/app/
yarn start