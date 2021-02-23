# Concordia Contracts Provider

Contracts provider is a **very** simple resource provider server that handles saving the contract artifacts produced
during contracts migration and serving them to the users (and pinner).

## Running Concordia

To start the application in development mode simply execute the `start` script:
```shell
yarn start
```

The application makes use of the environment variables described below.

| Environment variable | Default value | Usage |
| --- | --- | --- |
| CONTRACTS_PROVIDER_PORT | `8400` | Set the port of the contracts provider application |
| UPLOAD_CONTRACTS_DIRECTORY | `concordia/packages/concordia-contracts-provider/contracts-uploads` | Set the directory where the uploaded contracts are saved |
| LOGS_PATH | `concordia/packages/concordia-contracts-provider/logs` | Set the directory where the application logs are saved |
| CORS_ALLOWED_ORIGINS | `http://127.0.0.1:7000`, `http://localhost:7000`, `https://127.0.0.1:7000`, `https://localhost:7000`, `http://127.0.0.1:4444`, `http://localhost:4444`, `https://127.0.0.1:4444`, `https://localhost:4444` | Set the list of addresses allowed by CORS* |

* the `CORS_ALLOWED_ORIGINS` env var should be a semicolon-separated string, e.g. `127.0.0.1:7000;localhost:7000`.
