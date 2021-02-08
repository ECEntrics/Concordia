# --------------------------------------------------
# Stage 1 (Init application build base)
# --------------------------------------------------
FROM node:14-alpine@sha256:51e341881c2b77e52778921c685e711a186a71b8c6f62ff2edfc6b6950225a2f as base
LABEL maintainers.1="Apostolos Fanakis <apostolof@auth.gr>"
LABEL maintainers.2="Panagiotis Nikolaidis <ezerous@gmail.com>"
LABEL gr.thmmy.ecentrics.concordia-image.name="app"

WORKDIR /usr/src/concordia

# Copy the root package.json and yarn.lock
COPY ./package.json .
COPY ./yarn.lock .

# Copy package.json files from contracts, shared and app, then install modules
COPY ./packages/concordia-contracts/package.json ./packages/concordia-contracts/package.json
COPY ./packages/concordia-shared/package.json ./packages/concordia-shared/package.json
COPY ./packages/concordia-app/package.json ./packages/concordia-app/

# Install required packages
RUN apk update && apk --no-cache add g++ make python

RUN yarn install --frozen-lockfile

# Gets the rest of the source code
COPY ./packages/concordia-contracts ./packages/concordia-contracts
COPY ./packages/concordia-shared ./packages/concordia-shared
COPY ./packages/concordia-app ./packages/concordia-app

# Fix timezome
ARG TZ
ENV TZ=${TZ}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# --------------------------------------------------
# Stage 2 (Test)
# --------------------------------------------------
FROM base as test

WORKDIR /opt/concordia-app

COPY ./docker/concordia-app/test-app.sh .

WORKDIR /usr/src/concordia/packages/concordia-app

RUN ["chmod", "+x", "/opt/concordia-app/test-app.sh"]

ENTRYPOINT ["/opt/concordia-app/test-app.sh"]

# --------------------------------------------------
# Stage 3 (Build)
# --------------------------------------------------
FROM base as build

WORKDIR /usr/src/concordia/packages/concordia-app

RUN yarn build

# --------------------------------------------------
# Stage 4 (Staging runtime)
# --------------------------------------------------
FROM base as staging

WORKDIR /usr/src/concordia/packages/concordia-app

ENTRYPOINT ["yarn", "start"]

# --------------------------------------------------
# Stage 4 (Production runtime)
# --------------------------------------------------
FROM nginx:1.17-alpine@sha256:01747306a7247dbe928db991eab42e4002118bf636dd85b4ffea05dd907e5b66 as production
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
