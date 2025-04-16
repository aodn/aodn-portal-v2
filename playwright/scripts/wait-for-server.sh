#!/bin/bash

echo "Waiting for the web server to start"

timeout=360
interval=1
elapsed=0

while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' $BASE_URL)" != "200" && $elapsed -lt $timeout ]]; do
  sleep $interval
  elapsed=$((elapsed + interval))
done

if [[ $elapsed -ge $timeout ]]; then
  echo "Server did not start within $timeout seconds."
  exit 1
else
  echo "Server started successfully"
fi
