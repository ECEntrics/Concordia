# Concordia

The Concordia application is a React app that handles interactions with the contracts and the distributed database used.

This document provides information about the Concordia React Application and how to get it running for development.

## Prerequisites

Concordia requires at the minimum two services to work, a blockchain and a rendezvous server.

Furthermore, the deployed contract artifacts must be made available. This can be done in two ways, migrate the contracts
and make sure the artifacts are present in the `concordia/packages/concordia-contracts/build` directory, or migrate the
contracts and upload the artifacts to a contracts-provider instance.

## Running Concordia

To start the application in development mode simply execute the `start` script:
```shell
yarn start
```

The application makes use of the environment variables described below.

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

**Attention**: if using a contracts provider, make sure that the provider is set to allow CORS from the host-port combo
defined by `REACT_APP_CONCORDIA_HOST` and `REACT_APP_CONCORDIA_PORT`.
