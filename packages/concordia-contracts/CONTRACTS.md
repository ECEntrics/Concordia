# Concordia Contracts

In this package live the contracts that power Concordia.

This document provides information about how to build and migrate the contracts.

## Prerequisites

To migrate the contracts, the targeted blockchain must be up and running. Furthermore, if uploading to a contracts
provider, the provider must be available.

## Compiling

To compile the contracts execute the `compile` script:

```shell
yarn compile
```

## Linting

To lint the contracts execute the `lint` script:

```shell
yarn lint
```

## Testing

Default host and port values of the blockchain used for testing are:

| host | port |
|---|---|
| 127.0.0.1 | 8546 |


Test using the default network:

```shell script
yarn test
```

### Using different host and port values for testing blockchain

Define the host and port of the blockchain using environment variables (see below). Test using the `env` network:

```shell script
yarn test --network env
```

## Migrating

Default host and port values of the blockchain are:

| host | port |
|---|---|
| 127.0.0.1 | 8545 |

Migrate (using the development network by default):
```shell script
yarn migrate
```

### Setting different host and port values

Define the host and port of the blockchain using environment variables (see below). Migrate using the `env` network:

```shell script
yarn _migrate --network env
```

**Notice the underscore `_` prefix in the script name. This is not a mistake.**

## Uploading

Default hash and tag values used during contracts upload:

| hash | tag |
|---|---|
| <npm_package_version>-dev | latest |

To upload the contracts to a contracts provider instance execute the `upload` script:

```shell
yarn upload
```

### Setting different hash and tag values

Pass the hash and tag of the contracts during script call:

```shell script
yarn _upload <hash> <tag>
```

**Notice the underscore `_` prefix in the script name. This is not a mistake.**

## Environment Variables

The environment variables used are described below.

| Environment variable | Default value | Usage |
| --- | --- | --- |
| WEB3_HOST | `127.0.0.1` | Set the hostname of the blockchain |
| WEB3_PORT | `8545` | Set the port of the blockchain |
| CONTRACTS_PROVIDER_HOST | `http://127.0.0.1` | Set the hostname of the contracts provider |
| CONTRACTS_PROVIDER_PORT | `8400` | Set the port of the contracts provider |
