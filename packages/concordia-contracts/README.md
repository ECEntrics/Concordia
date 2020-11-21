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
Define the host and port of the blockchain in use.
Default values are:

| host | port |
|---|---|
| 127.0.0.1 | 8545 |

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

Migrate (using the development network here, change if necessary):
```shell script
yarn migrate --network develop
```

## Test contracts
Define the host and port of the blockchain in use.
Default values are:

| host | port |
|---|---|
| 127.0.0.1 | 8546 |

Linux:
```shell script
CHAIN_HOST="127.0.0.1"
CHAIN_PORT="7545"
```

Windows:
```shell script
SET CHAIN_HOST="127.0.0.1"
SET CHAIN_PORT="7545"
```

Test:
```shell script
yarn test
```
