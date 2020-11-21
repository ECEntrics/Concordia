FROM trufflesuite/ganache-cli:latest

RUN mkdir /home/ganache_db /home/ganache_keys

ENTRYPOINT ["node", \
    "/app/ganache-core.docker.cli.js", \
    "-a", "10", \
    "-e", "1000", \
    "-d", \
    "-m", "myth like bonus scare over problem client lizard pioneer submit female collect", \
    "-p", "8545", \
    "-i", "5778", \
    "--db", "/home/ganache_db/", \
    "-v", \
    "-h", "0.0.0.0", \
    "--account_keys_path", "/home/ganache_keys/keys.json", \
    "--allowUnlimitedContractSize", \
    "--noVMErrorsOnRPCResponse" \
]
