# Targets for building/running/stopping both apps (uses the docker-compose file)
build:
	@docker-compose -f ./docker-compose.yml -p concordia build;
run:
	@docker-compose -f ./docker-compose.yml -p concordia up -d
stop:
	@docker-compose -f ./docker-compose.yml -p concordia down
stop-clean-data:
	@docker-compose -f ./docker-compose.yml -p concordia down -v

# Contracts targets
build-contracts:
	@docker build ../ -f ./concordia-contracts/Dockerfile --target compile -t concordia-contracts --build-arg TZ=Europe/Athens
build-contracts-migrate:
	@docker build ../ -f ./concordia-contracts/Dockerfile -t concordia-contracts-migrate --build-arg TZ=Europe/Athens
build-contracts-tests:
	@docker build ../ -f ./concordia-contracts/Dockerfile --target test -t concordia-contracts-tests --build-arg TZ=Europe/Athens
run-contract-tests:
	@docker run --rm -v `pwd`/reports/contracts/:/usr/test-reports/ --env-file=./env/contracts.env --net=concordia_ganache-network concordia-contracts-tests:latest
run-contract-tests-host-chain:
	@docker run --rm -v `pwd`/reports/contracts/:/usr/test-reports/ --env-file=./env/contracts.env --net=host concordia-contracts-tests:latest
run-contracts-migrate:
	@cd .. &&\
	docker run --rm -v `pwd`/packages/concordia-contracts/build/:/usr/src/concordia/packages/concordia-contracts/build/ --env-file=./docker/env/contracts.docker.env --net=concordia_ganache-network concordia-contracts-migrate:latest
run-contracts-migrate-host-chain:
	@cd .. &&\
	docker run --rm -v `pwd`/packages/concordia-contracts/build/:/usr/src/concordia/packages/concordia-contracts/build/ --env-file=./docker/env/contracts.env --net=host concordia-contracts-migrate:latest
get-contracts:
	@cd .. && \
	docker run --rm -v `pwd`/packages/concordia-contracts/build/:/build --entrypoint=sh concordia-contracts:latest -c 'cp /usr/src/concordia/packages/concordia-contracts/build/* /build'

# App targets
build-app:
	@docker build ../ -f ./concordia-app/Dockerfile -t concordia-app --build-arg TZ=Europe/Athens
build-app-tests:
	@docker build ../ -f ./concordia-app/Dockerfile --target test -t concordia-app-tests --build-arg TZ=Europe/Athens
run-app-tests:
	@docker run --rm -v `pwd`/reports/app/:/usr/test-reports/ --env-file=./env/concordia.env concordia-app-tests:latest
run-app:
	@docker create --env-file=./env/concordia.docker.env -p 8473:80 --name concordia-app --net=concordia_ganache-network concordia-app:latest &&\
	docker network connect concordia_rendezvous-network concordia-app &&\
	docker start concordia-app
run-app-host-chain:
	@docker run -d --env-file=./env/concordia.env --name concordia-app --net=host concordia-app:latest

# Ganache targets
build-ganache:
	@docker build . -f ./ganache/Dockerfile -t concordia-ganache
run-ganache:
	@docker-compose -f ./ganache/docker-compose.yml -p concordia up -d

# Rendezvous targets
run-rendezvous:
	@docker-compose -f ./rendezvous/docker-compose.yml -p concordia up -d

# Other
clean-images:
	@docker rmi `docker images -q -f "dangling=true"`
