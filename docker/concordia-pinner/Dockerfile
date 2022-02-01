# --------------------------------------------------
# Stage 1 (Runtime)
# --------------------------------------------------
FROM node:16-buster@sha256:32362e2ea89c62d77c86c8f26ad936dbbdc170cd6c06c4d7ff7a809012bb0c32 as runtime
LABEL maintainers.1="Apostolos Fanakis <apostolof@auth.gr>"
LABEL maintainers.2="Panagiotis Nikolaidis <ezerous@gmail.com>"
LABEL gr.thmmy.ecentrics.concordia-image.name="pinner"

# Fix timezome (needed for timestamps on report files)
ARG TZ
ENV TZ=${TZ}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/concordia

# Copy the root package.json and yarn.lock
COPY ./package.json .
COPY ./yarn.lock .

# Copy package.json files from contracts, shared and pinner, then install modules
COPY ./packages/concordia-pinner/package.json ./packages/concordia-pinner/
COPY ./packages/concordia-contracts/package.json ./packages/concordia-contracts/
COPY ./packages/concordia-shared/package.json ./packages/concordia-shared/

RUN yarn install --frozen-lockfile --network-timeout 100000

# Gets the rest of the source code
COPY ./packages/concordia-shared ./packages/concordia-shared
COPY ./packages/concordia-contracts ./packages/concordia-contracts
COPY ./packages/concordia-pinner ./packages/concordia-pinner

WORKDIR /usr/src/concordia/packages/concordia-pinner

ENTRYPOINT ["yarn", "start"]