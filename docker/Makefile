PACKAGES := $(abspath ${CURDIR}/../packages)
REPORTS := $(abspath ${CURDIR}/reports)
GANACHE_VOLUMES := $(abspath ${CURDIR}/ganache/volumes)

# Targets for building/running/stopping the blockchain and rendezvous server (using the docker-compose file)
build:
	@docker-compose -f ./docker-compose.yml -p concordia build
run:
	@docker-compose -f ./docker-compose.yml -p concordia up -d
stop:
	@docker-compose -f ./docker-compose.yml -p concordia down
stop-clean-data:
	@docker-compose -f ./docker-compose.yml -p concordia down -v

# Ganache targets
build-ganache:
	@docker build ../ -f ./ganache/Dockerfile -t concordia-ganache
run-ganache:
	@docker network create --driver bridge concordia_ganache_network || true &&\
	docker run -d -v ${GANACHE_VOLUMES}/ganache_db:/home/ganache_db -v ${GANACHE_VOLUMES}/ganache_keys:/home/ganache_keys -p 8545:8545 --env-file=./env/ganache.env --name concordia-ganache --net=concordia_ganache_network concordia-ganache:latest
run-ganache-test:
	@docker network create --driver bridge concordia_ganache_test_network || true &&\
	docker run --rm -d -p 8546:8546 --env-file=./env/ganache.test.env --name concordia-ganache-test --net=concordia_ganache_test_network concordia-ganache:latest

# Rendezvous targets
run-rendezvous:
	@docker network create --driver bridge concordia_rendezvous_network || true &&\
	docker run -d -p 9090:9090 --name concordia-rendezvous libp2p/js-libp2p-webrtc-star:version-0.20.1

# Contracts targets
build-contracts:
	@docker build ../ -f ./concordia-contracts/Dockerfile --target compile -t concordia-contracts --build-arg TZ=Europe/Athens
build-contracts-migrate:
	@docker build ../ -f ./concordia-contracts/Dockerfile -t concordia-contracts-migrate --build-arg TZ=Europe/Athens
build-contracts-tests:
	@docker build ../ -f ./concordia-contracts/Dockerfile --target test -t concordia-contracts-tests --build-arg TZ=Europe/Athens
run-contracts-tests:
	@docker run --rm -v ${REPORTS}/contracts/:/usr/test-reports/ --env-file=./env/contracts.docker.env --net=concordia_ganache_test_network concordia-contracts-tests:latest
run-contracts-tests-host-chain:
	@docker run --rm -v ${REPORTS}/contracts/:/usr/test-reports/ --env-file=./env/contracts.env --net=host concordia-contracts-tests:latest
run-contracts-migrate:
	@docker run --rm -v ${PACKAGES}/concordia-contracts/build/:/usr/src/concordia/packages/concordia-contracts/build/ --env-file=./env/contracts.docker.env --net=concordia_ganache_network concordia-contracts-migrate:latest
run-contracts-migrate-host-chain:
	@docker run --rm -v ${PACKAGES}/concordia-contracts/build/:/usr/src/concordia/packages/concordia-contracts/build/ --env-file=./env/contracts.env --net=host concordia-contracts-migrate:latest
get-contracts:
	@docker run --rm -v ${PACKAGES}/concordia-contracts/build/:/build --entrypoint=sh concordia-contracts:latest -c 'cp /usr/src/concordia/packages/concordia-contracts/build/* /build'

# App targets
build-app:
	@docker build ../ -f ./concordia-app/Dockerfile -t concordia-app --build-arg TZ=Europe/Athens
build-app-tests:
	@docker build ../ -f ./concordia-app/Dockerfile --target test -t concordia-app-tests --build-arg TZ=Europe/Athens
run-app-tests:
	@docker run --rm -v ${REPORTS}/app/:/usr/test-reports/ --env-file=./env/concordia.docker.env concordia-app-tests:latest
run-app:
	@docker create --env-file=./env/concordia.docker.env -p 8473:80 --name concordia-app --net=concordia_ganache_network concordia-app:latest &&\
	docker network connect concordia_rendezvous_network concordia-app &&\
	docker start concordia-app
run-app-host-chain:
	@docker run -d --env-file=./env/concordia.env --name concordia-app --net=host concordia-app:latest

# Other
clean-images:
	@docker rmi `docker images -q -f "dangling=true"`
