FROM libp2p/websocket-star-rendezvous:release

# Can't use the array form of ENTRYPOINT here because we use env vars
ENTRYPOINT /usr/local/bin/dumb-init node --max-old-space-size=8192 src/bin.js --port="$RENDEZVOUS_PORT"
