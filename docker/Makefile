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
	@docker build ../ -f ./concordia-contracts/Dockerfile -t concordia-contracts --build-arg TZ=Europe/Athens --build-arg SKIP_TESTS="true" --build-arg SKIP_MIGRATE="true"
build-migrate-contracts:
	@docker build ../ -f ./concordia-contracts/Dockerfile -t concordia-contracts --build-arg TZ=Europe/Athens --build-arg SKIP_TESTS="true"
build-contracts-tests:
	@docker build ../ -f ./concordia-contracts/Dockerfile --target test -t concordia-contracts-tests --build-arg TZ=Europe/Athens
get-contracts:
	@cd .. && docker run --rm -v `pwd`/packages/concordia-contracts/build/:/build --entrypoint=sh concordia-contracts:latest -c 'cp /usr/src/concordia/packages/concordia-contracts/build/* /build'
get-contracts-tests:
	@docker run --rm -v `pwd`/reports/:/app concordia-contracts-tests:latest sh -c 'mkdir -p /app/contracts && cp /usr/test-reports/* /app/contracts'

# App targets
build-app:
	@docker build ../ -f ./concordia-app/Dockerfile -t concordia-app --build-arg TZ=Europe/Athens --build-arg SKIP_TESTS="true"
build-app-tests:
	@docker build ../ -f ./concordia-app/Dockerfile --target test -t concordia-app-tests --build-arg TZ=Europe/Athens
get-app-tests:
	@docker run --rm -v `pwd`/reports/:/app concordia-app-tests:latest sh -c 'mkdir -p /app/app && cp /usr/test-reports/* /app/app'

# Other
clean-images:
	@docker rmi `docker images -q -f "dangling=true"`
