# ----- Base image -----
FROM tarampampam/node:11-alpine as base
LABEL maintainer="apotwohd@gmail.com"

ENV DOCKER true

# Installs a couple (dozen) more tools like python, c++, make and others
RUN apk --no-cache add build-base

# Installs a couple (dozen) more tools like python, c++, make and others
RUN apk --no-cache add build-base \
    python3 && \
    if [ ! -e /usr/bin/python ]; then ln -sf python3 /usr/bin/python ; fi

# Installs truffle
RUN yarn global add truffle

WORKDIR /usr/apella

COPY ./package.json ./
COPY ./app/package.json ./app/

# ----- Dependencies -----
FROM base as dependencies

# Installs node packages from ./package.json
RUN yarn install

# Installs node packages from ./app/package.json
RUN cd app/ && yarn install

# ----- Test -----
#FROM dependencies AS test

# Preps directories
#COPY . .
# Runs linters and tests
#RUN  npm run lint && npm run test

# ----- Runtime -----
FROM base as runtime

# Copies node_modules
COPY --from=dependencies /usr/apella/node_modules ./node_modules
COPY --from=dependencies /usr/apella/app/node_modules ./app/node_modules

# Preps directories
COPY . .

RUN ["chmod", "+x", "/usr/apella/migrateAndStart.sh"]
ENTRYPOINT ["/usr/apella/migrateAndStart.sh"]
