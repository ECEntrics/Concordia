FROM trufflesuite/ganache-cli:latest

RUN mkdir /home/ganache_db /home/ganache_keys

ENTRYPOINT ["node", "/app/ganache-core.docker.cli.js", "-a", "10", "-e", "1000", "-d", "-m", "measure tree magic expire dad extend famous offer slight glory inherit weekend", "-p", "8545", "-i", "5778", "--db", "/home/ganache_db/", "-v", "--account_keys_path", "/home/ganache_keys/keys", "--allowUnlimitedContractSize", "--noVMErrorsOnRPCResponse"]