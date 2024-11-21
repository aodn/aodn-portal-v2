#!/bin/bash

env=$1

case $env in
  "dev")
    cat .env > .env.dev
    echo "VITE_APP_VERSION=local-pc" >> .env.dev
  ;;
  "edge")
    cat .env.config.edge > .env.edge
    echo "VITE_APP_VERSION=main-$(git rev-parse --short HEAD)" >> .env.edge
  ;;
  "staging")
    cat .env.config.staging > .env.staging
    echo "VITE_APP_VERSION=$(git describe --abbrev=0 --tags)" >> .env.staging
  ;;
  "prod")
    cat .env.config.prod > .env.prod
    echo "VITE_APP_VERSION=$(git describe --abbrev=0 --tags)" >> .env.prod
  ;;
  "test")
    cat .env.config.test > .env.dev
    echo "VITE_APP_VERSION=github-workflow" >> .env.dev
  ;;
esac
