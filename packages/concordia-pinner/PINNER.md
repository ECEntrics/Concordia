# Concordia Pinner

Pinner is a bot node of the network that pins all IPFS content, so the forum data may be available even if the users
that create it are not.

## Running Pinner

To start the application in development mode simply execute the `start` script:
```shell
yarn start
```

The application makes use of the environment variables described below.

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
