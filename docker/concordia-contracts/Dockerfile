# --------------------------------------------------
# Stage 1 (Init contracts build base)
# --------------------------------------------------
FROM node:10-alpine as base
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

# Copy the contracts package.json, then install modules
COPY ./packages/concordia-contracts/package.json ./packages/concordia-contracts/

RUN yarn install --frozen-lockfile --network-timeout 100000

# Gets the rest of the source code
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

WORKDIR /usr/src/concordia/packages/concordia-contracts

ARG SKIP_TESTS
ARG CI

RUN if [ -z "${SKIP_TESTS}" ]; then \
      yarn _eslint -f html -o /usr/test-reports/concordia-contracts-eslint.html --no-color \
      && (yarn _solhint > /usr/test-reports/concordia-contracts-solhint.report) \
      && (yarn test > /usr/test-reports/concordia-contracts-truffle-tests.report); \
      if [ $? -eq 0 ]; then \
        if [ -n "${CI}" ]; then \
          mkdir /usr/test-results && touch /usr/test-results/pass; \
        fi \
      else \
        echo "SOME TESTS FAILED!"; \
      fi \
    else \
      echo "Skipping tests..."; \
    fi

# --------------------------------------------------
# Stage 4 (Build)
# --------------------------------------------------
FROM compile as runtime
LABEL maintainers.1="Apostolos Fanakis <apostolof@auth.gr>"
LABEL maintainers.2="Panagiotis Nikolaidis <ezerous@gmail.com>"
LABEL gr.thmmy.ecentrics.concordia-image.name="contracts"

WORKDIR /opt/concordia-contracts

COPY ./docker/concordia-contracts/migrate.sh .
RUN ["chmod", "+x", "/opt/concordia-contracts/migrate.sh"]

ARG SKIP_MIGRATE
ENV SKIP_MIGRATE="${SKIP_MIGRATE}"

ENTRYPOINT ["/opt/concordia-contracts/migrate.sh"]
