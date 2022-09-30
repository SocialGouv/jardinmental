#!/bin/bash

echo "Copy .env files to ./android/fastlane/ folder"
# copy needed .env to android fastlane folder
[ -f .env ] && cp .env ./android/fastlane/.env
[ -f .env.default ] && cp .env.default ./android/fastlane/.env.default

echo "Start android Fastlane: internal"
# start fastlane
cd ./android && fastlane internal