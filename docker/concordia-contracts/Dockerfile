# --------------------------------------------------
# Stage 1 (Init contracts build base)
# --------------------------------------------------
FROM node:16-alpine@sha256:51e341881c2b77e52778921c685e711a186a71b8c6f62ff2edfc6b6950225a2f as base
LABEL maintainers.1="Apostolos Fanakis <apostolof@auth.gr>"
LABEL maintainers.2="Panagiotis Nikolaidis <ezerous@gmail.com>"
LABEL gr.thmmy.ecentrics.concordia-image.name="contracts"

# Fix timezome (needed for timestamps on report files)
ARG TZ

RUN apk add -U tzdata \
    && cp /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && apk del tzdata \
    && rm -rf /var/cache/apk/*

WORKDIR /usr/src/concordia

# Copy the root package.json and yarn.lock
COPY ./package.json .
COPY ./yarn.lock .

# Copy package.json files from shared and contracts, then install modules
COPY ./packages/concordia-shared/package.json ./packages/concordia-shared/
COPY ./packages/concordia-contracts/package.json ./packages/concordia-contracts/

RUN yarn install --frozen-lockfile --network-timeout 100000

# Gets the rest of the source code
COPY ./packages/concordia-shared ./packages/concordia-shared
COPY ./packages/concordia-contracts ./packages/concordia-contracts

# --------------------------------------------------
# Stage 2 (Compile)
# --------------------------------------------------
FROM base as compile

WORKDIR /usr/src/concordia/packages/concordia-contracts
RUN yarn compile

# --------------------------------------------------
# Stage 3 (Test)
# --------------------------------------------------
FROM compile as test

WORKDIR /opt/concordia-contracts

COPY ./docker/concordia-contracts/test-contracts.sh .

WORKDIR /usr/src/concordia/packages/concordia-contracts

RUN ["chmod", "+x", "/opt/concordia-contracts/test-contracts.sh"]

ENTRYPOINT ["/opt/concordia-contracts/test-contracts.sh"]

# --------------------------------------------------
# Stage 4 (Runtime)
# --------------------------------------------------
FROM compile as runtime
LABEL maintainers.1="Apostolos Fanakis <apostolof@auth.gr>"
LABEL maintainers.2="Panagiotis Nikolaidis <ezerous@gmail.com>"
LABEL gr.thmmy.ecentrics.concordia-image.name="contracts"

WORKDIR /opt/concordia-contracts

COPY ./docker/concordia-contracts/migrate.sh .
RUN ["chmod", "+x", "/opt/concordia-contracts/migrate.sh"]

ENTRYPOINT ["/opt/concordia-contracts/migrate.sh"]
