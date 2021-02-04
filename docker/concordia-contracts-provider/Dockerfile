# --------------------------------------------------
# Stage 1 (Runtime)
# --------------------------------------------------
FROM node:14-alpine as runtime
LABEL maintainers.1="Apostolos Fanakis <apostolof@auth.gr>"
LABEL maintainers.2="Panagiotis Nikolaidis <ezerous@gmail.com>"
LABEL gr.thmmy.ecentrics.concordia-image.name="contracts-provider"

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

# Copy the contracts provider package.json, then install modules
COPY ./packages/concordia-contracts-provider/package.json ./packages/concordia-contracts-provider/

RUN yarn install --frozen-lockfile --network-timeout 100000

# Gets the rest of the source code
COPY ./packages/concordia-contracts-provider ./packages/concordia-contracts-provider

WORKDIR /usr/src/concordia/packages/concordia-contracts-provider

ENTRYPOINT ["yarn", "start"]