FROM trufflesuite/ganache-cli:v6.12.2@sha256:c062707f17f355872d703cde3de6a12fc45a027ed42857c72514171a5f466ab7

RUN mkdir /home/ganache_db /home/ganache_keys

WORKDIR /opt/concordia-ganache

COPY ./docker/ganache/start-blockchain.sh .
RUN ["chmod", "+x", "/opt/concordia-ganache/start-blockchain.sh"]

ENTRYPOINT ["/opt/concordia-ganache/start-blockchain.sh"]
