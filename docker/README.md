# Concordia Docker Images

## Dockerfiles provided

Concordia uses blockchain and other distributed technologies. There are a number of ways to setup a running instance of
this application.

This README will guide you through a testing setup that depends on a local blockchain (ganache) which does not require
real ETH to work or has any other charges.

For this configuration the services needed are:

- A blockchain (ganache)
- A server that helps peers connect and route their messages to other (rendezvous)
- A service or provision system to compile and deploy the contracts to the blockchain (concordia-contracts image)
- An HTML server that provides access to the Concordia application (concordia-app image)

This repo provides Dockerfiles for all the above services.

## Concordia Contracts Image

Makefile
-> build contracts
-> build migrate
-> build tests
-> get contracts out
-> run tests
-> run migrate

env files

## Concordia Application Image
