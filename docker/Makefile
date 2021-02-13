.EXPORT_ALL_VARIABLES:
PACKAGES := $(abspath ${CURDIR}/../packages)
REPORTS := $(abspath ${CURDIR}/reports)
GANACHE_VOLUMES := $(abspath ${CURDIR}/ganache/volumes)
CONTRACTS_PROVIDER_VOLUMES := $(abspath ${CURDIR}/concordia-contracts-provider/volumes)
PINNER_VOLUMES := $(abspath ${CURDIR}/concordia-pinner/volumes)
DOCKER_BUILDKIT = 1

run: compose-run build-contracts-provider run-contracts-provider build-contracts-migrate run-contracts-migrate build-pinner run-pinner build-app run-app
	@echo "Concordia is up and running, head over to http://localhost:7777."
run-staging: compose-run build-contracts-provider run-contracts-provider-staging build-contracts-migrate run-contracts-migrate build-pinner run-pinner-staging build-app-staging run-app-staging
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
	@docker run -d -v ${GANACHE_VOLUMES}/ganache_keys:/mnt/concordia/ganache_keys -p 8545:8545 --env-file=./env/ganache.env --name concordia-ganache --net=concordia_concordia_network ecentrics/concordia-ganache:latest
run-ganache-test:
	@docker run --rm -d -p 8546:8546 --env-file=./env/ganache.test.env --name concordia-ganache-test --net=concordia_concordia_network ecentrics/concordia-ganache:latest

# Rendezvous targets
run-rendezvous:
	@docker network create --driver bridge concordia_concordia_network || true &&\
	docker run -d -p 9090:9090 --name concordia-rendezvous --net=concordia_concordia_network libp2p/js-libp2p-webrtc-star:version-0.20.5

# Contracts targets
build-contracts:
	@docker build ../ -f ./concordia-contracts/Dockerfile --target compile -t ecentrics/concordia-contracts --build-arg TZ=Europe/Athens
build-contracts-migrate:
	@docker build ../ -f ./concordia-contracts/Dockerfile -t ecentrics/concordia-contracts-migrate --build-arg TZ=Europe/Athens
build-contracts-tests:
	@docker build ../ -f ./concordia-contracts/Dockerfile --target test -t ecentrics/concordia-contracts-tests --build-arg TZ=Europe/Athens
run-contracts-tests:
	@docker run --rm -v ${REPORTS}/contracts/:/mnt/concordia/test-reports/ --env-file=./env/contracts.env --net=concordia_concordia_network ecentrics/concordia-contracts-tests:latest
run-contracts-tests-host-chain:
	@docker run --rm -v ${REPORTS}/contracts/:/mnt/concordia/test-reports/ --env-file=./env/contracts.env --net=host ecentrics/concordia-contracts-tests:latest
run-contracts-migrate:
	@docker run --rm -v ${PACKAGES}/concordia-contracts/build/:/usr/src/concordia/packages/concordia-contracts/build/ --env-file=./env/contracts.env --net=concordia_concordia_network ecentrics/concordia-contracts-migrate:latest
run-contracts-migrate-host-chain:
	@docker run --rm -v ${PACKAGES}/concordia-contracts/build/:/usr/src/concordia/packages/concordia-contracts/build/ --env-file=./env/contracts.env --net=host ecentrics/concordia-contracts-migrate:latest
get-contracts:
	@docker run --rm -v ${PACKAGES}/concordia-contracts/build/:/mnt/concordia/build --entrypoint=sh ecentrics/concordia-contracts:latest -c 'cp /usr/src/concordia/packages/concordia-contracts/build/* /mnt/concordia/build'

# App targets
build-app:
	@docker build ../ -f ./concordia-app/Dockerfile -t ecentrics/concordia-app --build-arg TZ=Europe/Athens
build-app-staging:
	@docker build ../ -f ./concordia-app/Dockerfile --target staging -t ecentrics/concordia-app-staging --build-arg TZ=Europe/Athens
build-app-tests:
	@docker build ../ -f ./concordia-app/Dockerfile --target test -t ecentrics/concordia-app-tests --build-arg TZ=Europe/Athens
run-app-tests:
	@docker run --rm -v ${REPORTS}/app/:/mnt/concordia/test-reports/ --env-file=./env/concordia.env ecentrics/concordia-app-tests:latest
run-app:
	@docker run -d --env-file=./env/concordia.env -p 7777:80 --name concordia-app ecentrics/concordia-app:latest
run-app-staging:
	@docker run -itd --env-file=./env/concordia.env -p 7000:3000 --name concordia-app-staging ecentrics/concordia-app-staging:latest
run-app-host-chain:
	@docker run -d --env-file=./env/concordia.env --name concordia-app --net=host ecentrics/concordia-app:latest

# Contracts provider targets
build-contracts-provider:
	@docker build ../ -f ./concordia-contracts-provider/Dockerfile -t ecentrics/concordia-contracts-provider --build-arg TZ=Europe/Athens
run-contracts-provider-staging:
	@docker run -d -v ${CONTRACTS_PROVIDER_VOLUMES}/contracts:/mnt/concordia/contracts --env-file=./env/contracts-provider.env -p 8400:8400 --name concordia-contracts-provider --net=concordia_concordia_network ecentrics/concordia-contracts-provider:latest
run-contracts-provider:
	@docker run -d -v ${CONTRACTS_PROVIDER_VOLUMES}/contracts:/mnt/concordia/contracts --env-file=./env/contracts-provider.env -e NODE_ENV=production -p 8400:8400 --name concordia-contracts-provider --net=concordia_concordia_network ecentrics/concordia-contracts-provider:latest

# Pinner targets
build-pinner:
	@docker build ../ -f ./concordia-pinner/Dockerfile -t ecentrics/concordia-pinner --build-arg TZ=Europe/Athens
run-pinner-staging:
	@docker run -d -v ${PINNER_VOLUMES}/orbitdb:/mnt/concordia/orbitdb --env-file=./env/pinner.env -p 4444:4444 --name concordia-pinner --net=concordia_concordia_network ecentrics/concordia-pinner:latest
run-pinner:
	@docker run -d -v ${PINNER_VOLUMES}/orbitdb:/mnt/concordia/orbitdb --env-file=./env/pinner.env -e NODE_ENV=production -p 4444:4444 --name concordia-pinner --net=concordia_concordia_network ecentrics/concordia-pinner:latest
run-pinner-staging-host:
	@docker run -d -v ${PINNER_VOLUMES}/orbitdb:/mnt/concordia/orbitdb --env-file=./env/pinner.env --net=host --name concordia-pinner ecentrics/concordia-pinner:latest
run-pinner-host:
	@docker run -d -v ${PINNER_VOLUMES}/orbitdb:/mnt/concordia/orbitdb --env-file=./env/pinner.env -e NODE_ENV=production --net=host --name concordia-pinner ecentrics/concordia-pinner:latest

# Other
clean-images:
	@docker rmi `docker images -q -f "dangling=true"`
