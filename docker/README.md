# Concordia Dockerized

This document gives information about the provided docker images, their configuration and supported deployment
strategies.

TLDR: head down to [Putting it all together/Scripts](#piat-mkfile-targets) for a quick setup.

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
peers in the network and get access to the data.

### Contracts Provider

Contracts provider is a **very** simple resource provider server that handles saving the contract artifacts produced
during contracts migration and serving them to the users (and pinner).

### Pinner

Pinner is a bot node of the network that pins all IPFS content, so the forum data may be available even if the users
that create it are not.

### Application

The Concordia application is a React app that handles interactions with the contracts and the distributed database used.

## Docker images

This repository provides docker images to easily setup (and destroy) instances of all required services Concordia.
Furthermore, we provide an image that builds the contracts and handles their migration to the blockchain in use.

### Ganache

The Dockerfile is provided in the path `./ganache`. The image makes use of the environment variables described
below.

| Environment variable | Default value | Usage |
| --- | --- | --- |
| ACCOUNTS_NUMBER | `10` | Set the number of accounts generated |
| ACCOUNTS_ETHER | `100` | Set the amount of ETH assigned to each account |
| MNEMONIC | `NaN` | The mnemonic phrase sued as a seed for deterministic account generation |
| HOST | `0.0.0.0` | The hostname to listen on |
| PORT | `8545` | The port to listen on |
| NETWORK_ID | `5778` | The network id used to identify ganache |

Note that the Ganache instance running inside the container will save the generated blockchain keys in the path
`/mnt/concordia/ganache_keys/keys.json`. If you need to access the keys (e.g. for getting a private key and importing in
Metamask) you can mount a volume to this path to have easier access.

Also, the database used by Ganache for storing blockchain information is placed in the path
`/mnt/concordia/ganache_db/`. You can maintain the blockchain state between runs by mounting a volume to the database
path. To do that, add the docker flag `-v host/absolute/path/to/ganache_db:/mnt/concordia/ganache_db`.

### Rendezvous

The rendezvous server used here is `js-libp2p-webrtc-star`. The server listens on port 9090. More information can be
found on the github page of the project [here](https://github.com/libp2p/js-libp2p-webrtc-star).

### Contracts provider

A Dockerfile for the contracts provider service is provided in the path `./concordia-contracts-provider`. The Dockerfile
contains only one stage, that is the runtime.

The image makes use of the environment variables described below.

| Environment variable | Default value | Usage |
| --- | --- | --- |
| CONTRACTS_PROVIDER_PORT | `8400` | Set the port of the contracts provider application |
| UPLOAD_CONTRACTS_DIRECTORY | `concordia/packages/concordia-contracts-provider/contracts-uploads` | Set the directory where the uploaded contracts are saved |
| LOGS_PATH | `concordia/packages/concordia-contracts-provider/logs` | Set the directory where the application logs are saved |
| CORS_ALLOWED_ORIGINS | `http://127.0.0.1:7000`, `http://localhost:7000`, `https://127.0.0.1:7000`, `https://localhost:7000`, `http://127.0.0.1:4444`, `http://localhost:4444`, `https://127.0.0.1:4444`, `https://localhost:4444` | Set the list of addresses allowed by CORS* |

### Contracts

This is a provision system that compiles and deploys the contracts to any Ethereum blockchain. It also uploads the
deployed contract artifacts to the contracts-provider service.

**Attention**: the contracts-provider instance targeted by the environment variables MUST be up and running before
attempting to migrate the contracts.

A Dockerfile is provided in the path `./concordia-contracts` that will build the contracts used by Concordia during
image build and handle their deployment to any Ethereum network defined using env-vars upon container run. Dockerfile
contains three useful stages, described in the table below.

| Stage name | Entrypoint | Usage |
| --- | --- | --- |
| compile | Exits immediately | Compiles the contracts |
| test | Runs contract tests | Compiles contracts and runs tests using blockchain defined by env vars |
| runtime | Migrates contracts | Compiles contracts and migrates to the blockchain defined by env vars. Does **not** run tests |

The image makes use of the environment variables described below.

| Environment variable | Default value | Usage |
| --- | --- | --- |
| MIGRATE_NETWORK | `develop` | Set the network where the contracts will be deployed/tested (set this to "env" unless you know what you're doing) |
| WEB3_HOST | `127.0.0.1` | Set the hostname of the blockchain network that will be used for deployment (requires network to be "env") |
| WEB3_PORT | `8545` | `NaN` | Set the port of the blockchain network that will be used for deployment (requires network to be "env") |
| CONTRACTS_PROVIDER_HOST | `http://127.0.0.1` | Set the hostname of the contracts provider |
| CONTRACTS_PROVIDER_PORT | `8400` | Set the port of the contracts provider |
| CONTRACTS_VERSION_TAG | `NaN` | Set the tag of the contracts uploaded to provided |

You can find the contract artifacts in the directory `/usr/src/concordia/packages/concordia-contracts/build/` inside
the image.

**Attention**: make sure the targeted blockchain is up and running before trying to migrate the contracts.

### Pinner

A Dockerfile for the pinner service is provided in the path `./concordia-pinner`. The Dockerfile contains only one
stage, that is the runtime.

The image makes use of the environment variables described below.

| Environment variable | Default value | Usage |
| --- | --- | --- |
| PINNER_API_HOST | `127.0.0.1` | Set the hostname of the pinner application |
| PINNER_API_PORT | `4444` | Set the port of the pinner application |
| USE_EXTERNAL_CONTRACTS_PROVIDER | `false` | Enable/Disable use of external contracts provider |
| IPFS_DIRECTORY | `concordia/packages/concordia-pinner/ipfs` | Set the directory where the ipfs blocks are saved |
| ORBIT_DIRECTORY | `concordia/packages/concordia-pinner/orbitdb` | Set the directory where the orbitdb data are saved |
| LOGS_PATH | `concordia/packages/concordia-pinner/logs` | Set the directory where the application logs are saved |
| WEB3_HOST | `127.0.0.1` | Set the hostname of the blockchain |
| WEB3_PORT | `8545` | Set the port of the blockchain |
| RENDEZVOUS_HOST | `/ip4/127.0.0.1` | Set the hostname of the rendezvous server |
| RENDEZVOUS_PORT | `9090` | Set the port of the rendezvous server |
| CONTRACTS_PROVIDER_HOST | `http://127.0.0.1` | Set the hostname of the contracts provider service |
| CONTRACTS_PROVIDER_PORT | `8400` | Set the port of the contracts provider service |
| CONTRACTS_VERSION_HASH | `latest` | Set the contracts tag that will be pulled |

### Application

The Dockerfile provided in the path `./concordia-application` either builds the application for production and serves
the resulting build using an nginx server or simply runs the node development server. Dockerfile contains four stages,
described in the table below.

| Stage name | Entrypoint | Usage |
| --- | --- | --- |
| test | Runs tests | Fetches npm packages and runs tests |
| staging | Serves application for development | Starts the node development server |
| runtime | Serves application for production | Builds for production and serves it through nginx |

The image makes use of the environment variables described below.

| Environment variable | Default value | Usage |
| --- | --- | --- |
| REACT_APP_CONCORDIA_HOST | `127.0.0.1` | Set the hostname of the concordia application |
| REACT_APP_CONCORDIA_PORT | `7000` | Set the port of the concordia application |
| REACT_APP_RENDEZVOUS_HOST | `/ip4/127.0.0.1` | Set the hostname of the rendezvous server |
| REACT_APP_RENDEZVOUS_PORT | `9090` | Set the port of the rendezvous server |
| REACT_APP_USE_EXTERNAL_CONTRACTS_PROVIDER | `false` | Enable/Disable use of external contracts provider |
| REACT_APP_CONTRACTS_PROVIDER_HOST | `http://127.0.0.1` | Set the hostname of the contracts provider service |
| REACT_APP_CONTRACTS_PROVIDER_PORT | `8400` | Set the port of the contracts provider service |
| REACT_APP_CONTRACTS_VERSION_HASH | `latest` | Set the contracts tag that will be pulled |

**Attention**: this image will copy the contract artifacts from the directory `/packages/concordia-contracts/build` if
available. The image can then use these artifacts after build or pull new artifacts from a contracts provider.

**Attention**: if you plan to use the imported contract artifacts instead of a provider, make sure the contracts have
been deployed before **building** this image. Also, make sure the rendezvous server is up and running.

## Docker Compose

A docker-compose file also is provided. The docker-compose handles the lifecycle of the Ganache and Rendezvous server
containers.

## Putting it all together

You can find some ready to use scripts for common scenarios like dev deploys and testing in the `./docker` directory.
These scripts are documented in the following chapters.

### <a name="piat-mkfile-targets"></a> Makefile targets

Concordia uses blockchain and other distributed technologies. There are a number of ways to set up a running instance of
this application.

This chapter will guide you through simple setups for testing and production that depend on local blockchain (ganache)
instances which do not require real ETH to work or have any other charges.

#### Testing the contracts

Build the ganache image and spin up a blockchain for testing:

```shell
make build-ganache run-ganache-test
```

Build the testing stage of the contracts image:

```shell
make build-contracts-tests
```

Run the tests:

```shell
make run-contracts-tests
```

The results should be printed in the terminal, but are also available in the directory `./reports/contracts`.

#### Testing the application

Build the testing stage of the application image:

```shell
make build-app-tests
```

Run the test:

```shell
make run-app-tests
```

The results should be printed in the terminal, but are also available in the directory `./reports/app`.

#### Production

Just run the target:

```shell
make run
```

And you' re done! Head to [localhost:7777](localhost:7777) and voilà, a working Concordia instance appears! The
blockchain is exposed in the address `localhost:8545`.

**Tip**: the accounts (private keys) generated by Ganache are available in the file `./volumes/ganache_keys/keys.json`.

Note that the `make run` command might take several minutes to execute (depending on your system). What happens under
the hood is that:

- the ganache image is built
- blockchain and rendezvous server containers are started
- migration stage of the contracts image is built
- the contracts are deployed to the blockchain:
- the application image is built and then deployed

### Env Files

Targets in the Makefile make use of env files located in the directory `./env`. Using this environment variables, you
can change various configuration options of the testing/production deploys.

Makefile targets suffixed with `host-chain` will try to use a blockchain and rendezvous server running in the host
machine. They use the `--net=host` docker option. In order to work with these targets you need to create and use your
own env files (or modify the existing ones). The environment variables values will largely depend on how you choose to
run the services in your system (which ports you use etc.), so be sure to create them before running any `host-chain`
target.
