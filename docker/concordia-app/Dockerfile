# --------------------------------------------------
# Stage 1 (Init application build base)
# --------------------------------------------------
FROM node:14-buster as base
LABEL maintainers.1="Apostolos Fanakis <apostolof@auth.gr>"
LABEL maintainers.2="Panagiotis Nikolaidis <ezerous@gmail.com>"
LABEL gr.thmmy.ecentrics.concordia-image.name="app"

WORKDIR /usr/src/concordia

# Copy the root package.json and yarn.lock
COPY ./package.json .
COPY ./yarn.lock .

# Copy package.json files from contracts and app, then install base modules
COPY ./packages/concordia-contracts/package.json ./packages/concordia-contracts/package.json
COPY ./packages/concordia-app/package.json ./packages/concordia-app/

RUN yarn install --frozen-lockfile

# Gets the rest of the source code
COPY ./packages/concordia-contracts ./packages/concordia-contracts
COPY ./packages/concordia-app ./packages/concordia-app

# --------------------------------------------------
# Stage 2 (Test)
# --------------------------------------------------
FROM base as test

# Fix timezome (needed for timestamps on report files)
ARG TZ
ENV TZ=${TZ}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /opt/concordia-app

COPY ./docker/concordia-app/test-app.sh .

WORKDIR /usr/src/concordia/packages/concordia-app

ENTRYPOINT ["/opt/concordia-app/test-app.sh"]

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

COPY ./docker/concordia-app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx --from=build /usr/src/concordia/packages/concordia-app/build .
