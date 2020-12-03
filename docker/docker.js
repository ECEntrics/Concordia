#! /usr/bin/env node
var shell = require("shelljs");

var target = process.argv[2];
var pwd;

switch (target) {
    // ===========================================================================
    // Targets for building/running/stopping the blockchain and rendezvous server
    // ===========================================================================
    case 'build':
        shell.cd('docker');
        shell.exec('docker-compose -f ./docker-compose.yml -p concordia build');
        break;
    case 'run':
        shell.cd('docker');
        shell.exec('docker-compose -f ./docker-compose.yml -p concordia up -d');
        break;
    case 'stop':
        shell.cd('docker');
        shell.exec('docker-compose -f ./docker-compose.yml -p concordia down');
        break;
    case 'stop-clean-data':
        shell.cd('docker');
        shell.exec('docker-compose -f ./docker-compose.yml -p concordia down -v');
        break;

    // ===========================================================================
    // Ganache targets
    // ===========================================================================
    case 'build-ganache':
        shell.cd('docker');
        shell.exec('docker build ../ -f ./ganache/Dockerfile -t concordia-ganache');
        break;
    case 'run-ganache':
        shell.cd('docker');
        pwd = shell.pwd();
        shell.exec('docker network create --driver bridge concordia_ganache_network');
        shell.exec(`docker run
            -d
            -v ${pwd}/volumes/ganache_db:/home/ganache_db\
            -v ${pwd}/volumes/ganache_keys:/home/ganache_keys\
            -p 8545:8545\
            --env-file=./env/ganache.env\
            --name concordia-ganache\
            --net=concordia_ganache_network\
            concordia-ganache:latest`);
        break;
    case 'run-ganache-test':
        shell.cd('docker');
        shell.exec('docker network create --driver bridge concordia_ganache_test_network');
        shell.exec(`docker run\
        --rm\
        -d\
        -p 8546:8546\
        --env-file=./env/ganache.test.env\
        --name concordia-ganache-test\
        --net=concordia_ganache_test_network\
        concordia-ganache:latest`);
        break;

    // ===========================================================================
    // Rendezvous targets
    // ===========================================================================
    case 'run-rendezvous':
        shell.cd('docker');
        shell.exec('docker network create --driver bridge concordia_rendezvous_network');
        shell.exec(`docker run\
        -d\
        -p 9090:9090\
        --name concordia-rendezvous\
        libp2p/js-libp2p-webrtc-star:version-0.20.1`);
        break;

    // Contracts targets
    case 'build-contracts':
        shell.cd('docker');
        shell.exec(`docker build\
        ../\
        -f ./concordia-contracts/Dockerfile\
        --target compile\
        -t concordia-contracts\
        --build-arg TZ=Europe/Athens`);
        break;
    case 'build-contracts-migrate':
        shell.cd('docker');
        shell.exec(`docker build\
        ../\
        -f ./concordia-contracts/Dockerfile\
        -t concordia-contracts-migrate\
        --build-arg TZ=Europe/Athens`);
        break;
    case 'build-contracts-tests':
        shell.cd('docker');
        shell.exec(`docker build\
        ../\
        -f ./concordia-contracts/Dockerfile\
        --target test\
        -t concordia-contracts-tests\
        --build-arg TZ=Europe/Athens`);
        break;
    case 'run-contract-tests':
        shell.cd('docker');
        pwd = shell.pwd();
        shell.exec(`docker run\
        --rm\
        -v ${pwd}/reports/contracts/:/usr/test-reports/\
        --env-file=./env/contracts.docker.env\
        --net=concordia_ganache_test_network\
        concordia-contracts-tests:latest`);
        break;
    case 'run-contract-tests-host-chain':
        shell.cd('docker');
        pwd = shell.pwd();
        shell.exec(`docker run\
        --rm\
        -v ${pwd}/reports/contracts/:/usr/test-reports/\
        --env-file=./env/contracts.env\
        --net=host concordia-contracts-tests:latest`);
        break;
    case 'run-contracts-migrate':
        pwd = shell.pwd();
        shell.exec(`docker run\
        --rm\
        -v ${pwd}/packages/concordia-contracts/build/:/usr/src/concordia/packages/concordia-contracts/build/\
        --env-file=./docker/env/contracts.docker.env\
        --net=concordia_ganache_network\
        concordia-contracts-migrate:latest`);
        break;
    case 'run-contracts-migrate-host-chain':
        pwd = shell.pwd();
        shell.exec(`docker run\
        --rm\
        -v ${pwd}/packages/concordia-contracts/build/:/usr/src/concordia/packages/concordia-contracts/build/\
        --env-file=./docker/env/contracts.env\
        --net=host\
        concordia-contracts-migrate:latest`);
        break;
    case 'get-contracts':
        pwd = shell.pwd();
        shell.exec(`docker run\
        --rm\
        -v ${pwd}/packages/concordia-contracts/build/:/build\
        --entrypoint=sh\
        concordia-contracts:latest\
        -c 'cp /usr/src/concordia/packages/concordia-contracts/build/* /build'`);
        break;

    // ===========================================================================
    // App targets
    // ===========================================================================
    case 'build-app':
        shell.cd('docker');
        shell.exec(`docker build\
        ../\
        -f ./concordia-app/Dockerfile\
        -t concordia-app\
        --build-arg TZ=Europe/Athens`);
        break;
    case 'build-app-tests':
        shell.cd('docker');
        shell.exec(`docker build\
        ../\
        -f ./concordia-app/Dockerfile\
        --target test\
        -t concordia-app-tests\
        --build-arg TZ=Europe/Athens`);
        break;
    case 'run-app-tests':
        shell.cd('docker');
        pwd = shell.pwd();
        shell.exec(`docker run\
        --rm\
        -v ${pwd}/reports/app/:/usr/test-reports/\
        --env-file=./env/concordia.docker.env\
        concordia-app-tests:latest`);
        break;
    case 'run-app':
        shell.cd('docker');
        shell.exec(`docker create\
        --env-file=./env/concordia.docker.env\
        -p 8473:80\
        --name concordia-app\
        --net=concordia_ganache_network\
        concordia-app:latest`);
        shell.exec('docker network connect concordia_rendezvous_network concordia-app');
        shell.exec('docker start concordia-app');
        break;
    case 'run-app-host-chain':
        shell.exec(`docker run\
        -d\
        --env-file=./env/concordia.env\
        --name concordia-app\
        --net=host\
        concordia-app:latest`)
        break;
}
