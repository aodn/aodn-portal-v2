#!/bin/sh

# Make the wait script executable
chmod +x /app/scripts/wait-for-server.sh

# Wait for the web server to be ready
if ! /app/scripts/wait-for-server.sh; then
    echo "Server did not start successfully. Skipping tests."
    exit 1
fi

# Only shard when CI asks for it, so a bare `yarn playwright` still runs
# the whole suite.
split_args=""
if [ -n "$PYTEST_SPLITS" ] && [ -n "$PYTEST_GROUP" ]; then
    split_args="--splits $PYTEST_SPLITS --group $PYTEST_GROUP"
fi

exec python3 -m poetry run pytest \
    --numprocesses "${PYTEST_WORKERS:-2}" \
    --tracing retain-on-failure \
    $split_args
