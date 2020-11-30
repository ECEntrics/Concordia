# Concordia Dockerized

This README provides information about the provided docker images, their configuration and supported deployment
strategies.

TLDR: head down to the [Putting it all together/Scripts](#piat-mkfile-targets) for a quick setup.

## Services

Concordia requires at the minimum two services to work, a blockchain and a rendezvous server.

Additionally, the Concordia application code must be provided to the user. Currently, the only way of distributing the
application code is via a webserver as a web application.

### Ganache

Ganache is a personal blockchain software used during development. It is a very convenient way of developing and testing
dApps. More information can be found in the project's [website](https://www.trufflesuite.com/ganache).

Note that any other Ethereum compliant blockchain can be used.

### Rendezvous

Concordia uses a distributed database to store forum data. A rendezvous server is needed in order for users to discover
peers in the network and get access to the network.

### Application

The Concordia application is a React app that handles interactions with the contracts and the distributed database used.

## Docker images

This repository provides docker images to easily setup (and destroy) instances of all required services Concordia.
Furthermore, we provide an image that builds the contracts and handles their migration to the blockchain in use.

### Ganache

The Dockerfile is provided in the path `./docker/ganache`. The image makes use of the environment variables described
bellow.

| Environment variable | Default value | Usage |
| --- | --- | --- |
| ACCOUNTS_NUMBER | 10 | Set the number of accounts generated |
| ACCOUNTS_ETHER | 10 | Set the amount of ETH assigned to each account |
| MNEMONIC | myth like bonus scare over problem client lizard pioneer submit female collect | The mnemonic phrase sued as a seed for deterministic account generation |
| HOST | 0.0.0.0 | The hostname to listen on |
| PORT | 8545 | The port to listen on |
| NETWORK_ID | 5778 | The network id used to identify ganache |

Note that the Ganache instance running inside the container will save the generated blockchain keys in the path
`/home/ganache_keys/keys.json`. If you need to access the keys (eg for getting a private key and importing in Metamask)
you can mount a volume to this path to have easier access.

Also, the database used by Ganache for storing blockchain information is placed in the path `/home/ganache_db/`. You can
maintain the blockchain state between runs by mounting a volume to the database path.

### Rendezvous

The rendezvous server used here is `js-libp2p-webrtc-star`. The server listens on port 9090. More information can be
found on the github page of the project [here](https://github.com/libp2p/js-libp2p-webrtc-star).

### Contracts

This is a provision system that compiles and deploys the contracts to any Ethereum blockchain.

A Dockerfile is provided in the path `./docker/concordia-contracts` that will build the contracts used by Concordia and
handle their deployment to any Ethereum network defined using env-vars upon container run. The image makes use of the
environment variables described bellow.

| Environment variable | Default value | Usage |
| --- | --- | --- |
| MIGRATE_NETWORK | develop | Set the network where the contracts will be deployed/tested (set to env unless you know what you're doing) |
| DEPLOY_CHAIN_HOST | NaN | Set the hostname of the blockchain network that will be used for deployment |
| DEPLOY_CHAIN_PORT | NaN | Set the port of the blockchain network that will be used for deployment |
| TEST_CHAIN_HOST | NaN | Set the hostname of the blockchain network that will be used for testing |
| TEST_CHAIN_PORT | NaN | Set the port of the blockchain network that will be used for testing |

You can find the contract artifacts in the directory `/usr/src/concordia/packages/concordia-contracts/build/` inside
the image.

**Attention**: make sure the targeted blockchain is up and running before trying to migrate the contracts.

### Application

The Dockerfile provided in the path `./docker/concordia-application` builds the application for production and serves
the resulting build using an nginx server. The image makes use of the environment variables described bellow.

| Environment variable | Default value | Usage |
| --- | --- | --- |
| REACT_APP_RENDEZVOUS_HOST | 127.0.0.1 | Set the hostname of the rendezvous server |
| REACT_APP_RENDEZVOUS_PORT | 9090 | Set the port of the rendezvous server |

**Attention**: this image will copy the contract artifacts from the directory `/packages/concordia-contracts/build`.
The image is bound the these artifacts after build. If the contracts (and hence the artifacts) change the image must be
re-built for the changes to take effect.

**Attention**: make sure the contracts have been deployed before **building** this image. Also, make sure the rendezvous
server is up and running.

## Docker Compose

A docker-compose file also is provided. The docker-compose handles the lifecycle of the Ganache and Rendezvous server
containers.

## Putting it all together

You can find some ready to use scripts for common scenarios like dev deploys and testing in the `./docker` directory.
These scripts are documented in the following chapters.

### <a name="piat-mkfile-targets"></a> Makefile targets

Concordia uses blockchain and other distributed technologies. There are a number of ways to setup a running instance of
this application.

This chapter will guide you through a testing and a production setup that depend on local blockchain (ganache) instances
which do not require real ETH to work or have any other charges.

TODO

### Env Files

TODO
