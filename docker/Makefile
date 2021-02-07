.EXPORT_ALL_VARIABLES:
PACKAGES := $(abspath ${CURDIR}/../packages)
REPORTS := $(abspath ${CURDIR}/reports)
GANACHE_VOLUMES := $(abspath ${CURDIR}/ganache/volumes)
CONTRACTS_PROVIDER_VOLUMES := $(abspath ${CURDIR}/concordia-contracts-provider/volumes)
DOCKER_BUILDKIT = 1
PINNER_VOLUMES := $(abspath ${CURDIR}/pinner/volumes)

run: compose-run build-contracts-migrate run-contracts-migrate build-app run-app
	@echo "Concordia is up and running, head over to http://localhost:7777."
run-staging: compose-run build-contracts-migrate run-contracts-migrate build-app-staging run-app-staging
	@echo "Concordia is up and running, head over to http://localhost:7000."

# Targets for building/running/stopping the blockchain and rendezvous server (using the docker-compose file)
compose-build:
	@docker-compose -f ./docker-compose.yml -p concordia build
compose-run:
	@docker-compose -f ./docker-compose.yml -p concordia up -d
compose-stop:
	@docker-compose -f ./docker-compose.yml -p concordia down
compose-stop-clean-data:
	@docker-compose -f ./docker-compose.yml -p concordia down -v

# Ganache targets
build-ganache:
	@docker build ../ -f ./ganache/Dockerfile -t ecentrics/concordia-ganache
run-ganache:
	@docker network create --driver bridge concordia_ganache_network || true &&\
	docker run -d -v ${GANACHE_VOLUMES}/ganache_keys:/home/ganache_keys -p 8545:8545 --env-file=./env/ganache.env --name concordia-ganache --net=concordia_ganache_network ecentrics/concordia-ganache:latest
run-ganache-test:
	@docker network create --driver bridge concordia_ganache_test_network || true &&\
	docker run --rm -d -p 8546:8546 --env-file=./env/ganache.test.env --name concordia-ganache-test --net=concordia_ganache_test_network ecentrics/concordia-ganache:latest

# Rendezvous targets
run-rendezvous:
	@docker network create --driver bridge concordia_rendezvous_network || true &&\
	docker run -d -p 9090:9090 --name concordia-rendezvous libp2p/js-libp2p-webrtc-star:version-0.20.5

# Contracts targets
build-contracts:
	@docker build ../ -f ./concordia-contracts/Dockerfile --target compile -t ecentrics/concordia-contracts --build-arg TZ=Europe/Athens
build-contracts-migrate:
	@docker build ../ -f ./concordia-contracts/Dockerfile -t ecentrics/concordia-contracts-migrate --build-arg TZ=Europe/Athens
build-contracts-tests:
	@docker build ../ -f ./concordia-contracts/Dockerfile --target test -t ecentrics/concordia-contracts-tests --build-arg TZ=Europe/Athens
run-contracts-tests:
	@docker run --rm -v ${REPORTS}/contracts/:/usr/test-reports/ --env-file=./env/contracts.env --net=concordia_ganache_test_network ecentrics/concordia-contracts-tests:latest
run-contracts-tests-host-chain:
	@docker run --rm -v ${REPORTS}/contracts/:/usr/test-reports/ --env-file=./env/contracts.env --net=host ecentrics/concordia-contracts-tests:latest
run-contracts-migrate:
	@docker run --rm -v ${PACKAGES}/concordia-contracts/build/:/usr/src/concordia/packages/concordia-contracts/build/ --env-file=./env/contracts.env --net=concordia_ganache_network ecentrics/concordia-contracts-migrate:latest
run-contracts-migrate-host-chain:
	@docker run --rm -v ${PACKAGES}/concordia-contracts/build/:/usr/src/concordia/packages/concordia-contracts/build/ --env-file=./env/contracts.env --net=host ecentrics/concordia-contracts-migrate:latest
get-contracts:
	@docker run --rm -v ${PACKAGES}/concordia-contracts/build/:/build --entrypoint=sh ecentrics/concordia-contracts:latest -c 'cp /usr/src/concordia/packages/concordia-contracts/build/* /build'

# App targets
build-app:
	@docker build ../ -f ./concordia-app/Dockerfile -t ecentrics/concordia-app --build-arg TZ=Europe/Athens
build-app-staging:
	@docker build ../ -f ./concordia-app/Dockerfile --target staging -t ecentrics/concordia-app-staging --build-arg TZ=Europe/Athens
build-app-tests:
	@docker build ../ -f ./concordia-app/Dockerfile --target test -t ecentrics/concordia-app-tests --build-arg TZ=Europe/Athens
run-app-tests:
	@docker run --rm -v ${REPORTS}/app/:/usr/test-reports/ --env-file=./env/concordia.env ecentrics/concordia-app-tests:latest
run-app:
	@docker create --env-file=./env/concordia.env -p 7777:80 --name concordia-app --net=concordia_ganache_network ecentrics/concordia-app:latest &&\
	docker network connect concordia_rendezvous_network concordia-app &&\
	docker start concordia-app
run-app-staging:
	@docker create -it --env-file=./env/concordia.env -p 7000:3000 --name concordia-app-staging --net=concordia_ganache_network ecentrics/concordia-app-staging:latest &&\
	docker network connect concordia_rendezvous_network concordia-app-staging &&\
	docker start concordia-app-staging
run-app-host-chain:
	@docker run -d --env-file=./env/concordia.env --name concordia-app --net=host ecentrics/concordia-app:latest

# Contracts provider targets
build-contracts-provider:
	@docker build ../ -f ./concordia-contracts-provider/Dockerfile -t ecentrics/concordia-contracts-provider --build-arg TZ=Europe/Athens
run-contracts-provider-staging:
	@docker run -d -v ${CONTRACTS_PROVIDER_VOLUMES}/contracts:/data/contracts --env-file=./env/contracts-provider.env -e NODE_ENV=production -p 8400:8400 --name concordia-contracts-provider ecentrics/concordia-contracts-provider:latest
run-contracts-provider:
	@docker run -d -v ${CONTRACTS_PROVIDER_VOLUMES}/contracts:/data/contracts --env-file=./env/contracts-provider.env -p 8400:8400 --name concordia-contracts-provider ecentrics/concordia-contracts-provider:latest

# Contracts provider targets
build-pinner:
	@docker build ../ -f ./concordia-pinner/Dockerfile -t ecentrics/concordia-pinner --build-arg TZ=Europe/Athens
run-pinner-staging:
	@docker run -d -v ${PINNER_VOLUMES}/orbitdb:/data/orbitdb --env-file=./env/pinner.env -e NODE_ENV=production -p 4444:4444 --name concordia-pinner ecentrics/concordia-pinner:latest
run-pinner:
	@docker run -d -v ${PINNER_VOLUMES}/orbitdb:/data/orbitdb --env-file=./env/pinner.env -p 4444:4444 --name concordia-pinner ecentrics/concordia-pinner:latest
run-pinner-staging-host:
	@docker run -d -v ${PINNER_VOLUMES}/orbitdb:/data/orbitdb --env-file=./env/pinner.env -e NODE_ENV=production --net=host --name concordia-pinner ecentrics/concordia-pinner:latest
run-pinner-host:
	@docker run -d -v ${PINNER_VOLUMES}/orbitdb:/data/orbitdb --env-file=./env/pinner.env --net=host --name concordia-pinner ecentrics/concordia-pinner:latest

# Other
clean-images:
	@docker rmi `docker images -q -f "dangling=true"`
