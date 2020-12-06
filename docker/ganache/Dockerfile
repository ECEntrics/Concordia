FROM trufflesuite/ganache-cli:latest

RUN mkdir /home/ganache_db /home/ganache_keys

WORKDIR /opt/concordia-ganache

COPY ./docker/ganache/start-blockchain.sh .
RUN ["chmod", "+x", "/opt/concordia-ganache/start-blockchain.sh"]

ENTRYPOINT ["/opt/concordia-ganache/start-blockchain.sh"]
