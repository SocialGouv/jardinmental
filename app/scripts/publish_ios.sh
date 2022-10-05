#!/bin/bash

echo "Copy .env files to ./ios/fastlane/ folder"
# copy needed .env to ios fastlane folder
[ -f .env ] && cp .env.production ./ios/fastlane/.env
[ -f .env.default ] && cp .env.default ./ios/fastlane/.env.default

echo "Start ios Fastlane: testFlightLocal"
# start fastlane
cd ./ios && fastlane testFlightLocal