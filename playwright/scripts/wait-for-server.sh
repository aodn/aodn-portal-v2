#!/bin/bash

echo "Waiting for the web server to start"

timeout=150
interval=1
elapsed=0

echo "BASE_URL is set to: $BASE_URL"

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
