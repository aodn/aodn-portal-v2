#!/bin/sh

# Make the wait script executable
chmod +x /app/scripts/wait-for-server.sh

# Wait for the web server to be ready
/app/scripts/wait-for-server.sh

# Check the exit code of wait-for-server.sh
if [ $? -eq 1 ]; then
    echo "Server did not start successfully. Skipping tests."
    exit 1
else
    python3 -m poetry run pytest --numprocesses auto --tracing retain-on-failure
fi
