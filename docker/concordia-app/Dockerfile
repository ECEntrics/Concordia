# --------------------------------------------------
# Stage 1 (Init contracts build base)
# --------------------------------------------------
FROM node:10-alpine as base
LABEL maintainers.1="Apostolos Fanakis <apostolof@auth.gr>"
LABEL maintainers.2="Panagiotis Nikolaidis <ezerous@gmail.com>"
LABEL gr.thmmy.ecentrics.concordia-image.name="app"

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

# Copy package.json files from contracts and app, then install base modules
COPY ./packages/concordia-contracts/package.json ./packages/concordia-contracts/package.json
COPY ./packages/concordia-app/package.json ./packages/concordia-app/

RUN yarn install --frozen-lockfile

# Gets the rest of the source code
COPY ./packages ./packages

# --------------------------------------------------
# Stage 2 (Test)
# --------------------------------------------------
FROM base as test

WORKDIR /usr/src/concordia/packages/concordia-app

ARG SKIP_TESTS
ARG CI

RUN if [ -z "${SKIP_TESTS}" ]; then \
      yarn lint -f html -o /usr/test-reports/concordia-app-eslint.html --no-color; \
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
# Stage 3 (Build)
# --------------------------------------------------
FROM base as build

WORKDIR /usr/src/concordia/packages/concordia-app

RUN yarn build

# --------------------------------------------------
# Stage 4 (Runtime)
# --------------------------------------------------
FROM nginx:1.17-alpine as runtime
LABEL maintainers.1="Apostolos Fanakis <apostolof@auth.gr>"
LABEL maintainers.2="Panagiotis Nikolaidis <ezerous@gmail.com"
LABEL gr.thmmy.ecentrics.concordia-image.name="app"

# Fix timezome
ARG TZ

RUN apk add -U tzdata \
    && cp /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && apk del tzdata \
    && rm -rf /var/cache/apk/*

WORKDIR "/var/www/concordia-app"

COPY ./packages/concordia-app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx --from=build /usr/src/concordia/packages/concordia-app/build .
