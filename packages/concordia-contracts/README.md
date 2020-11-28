# Concordia Contracts Package

This is the package where the contracts that power Concordia live.

## Compile contracts

```shell script
yarn compile
```

## Lint contracts (and tests)
```shell script
yarn lint
```

## Migrate contracts
Default host and port values of the blockchain are:

| host | port |
|---|---|
| 127.0.0.1 | 8545 |

Migrate (using the development network by default):
```shell script
yarn migrate
```

### Setting different host and port values
Define the host and port of the blockchain in use.

Linux:
```shell script
export CHAIN_HOST="127.0.0.1"
export CHAIN_PORT="7545"
```

Windows:
```shell script
SET CHAIN_HOST="127.0.0.1"
SET CHAIN_PORT="7545"
```

Migrate using the `env` network :
```shell script
yarn _migrate --network env
```
**Notice the underscore `_` suffix in the script name. This is not a mistake.**

## Test contracts
Default host and port values of the blockchain are:

| host | port |
|---|---|
| 127.0.0.1 | 8546 |


Test:
```shell script
yarn test
```

### Setting different host and port values
Define the host and port of the blockchain in use like above.

Test:
```shell script
yarn test --network env
```
