#!/bin/bash

LAST_BUILD_TIME=$(stat -c %Y playwright/.docker_build_time 2>/dev/null || echo 0)
PACKAGE_JSON_MODIFIED=$(stat -c %Y package.json)
PYPROJECT_TOML_MODIFIED=$(stat -c %Y playwright/pyproject.toml)

web_needs_build=$([[ $PACKAGE_JSON_MODIFIED -gt $LAST_BUILD_TIME ]] && echo "true" || echo "false")
test_needs_build=$([[ $PYPROJECT_TOML_MODIFIED -gt $LAST_BUILD_TIME ]] && echo "true" || echo "false")

if [[ $web_needs_build == "true" && $test_needs_build == "true" ]]; then
  echo "Running docker build..."
  docker-compose -f playwright/docker-compose.yml build
elif [[ $web_needs_build == "true" ]]; then
  echo "Rebuilding aodn-portal-v2..."
  docker-compose -f playwright/docker-compose.yml build web
elif [[ $test_needs_build == "true" ]]; then
  echo "Rebuilding playwright test suite..."
  docker-compose -f playwright/docker-compose.yml build tests
else
  echo "Running docker-compose"
fi

touch playwright/.docker_build_time

docker-compose -f playwright/docker-compose.yml up --abort-on-container-exit --exit-code-from tests
