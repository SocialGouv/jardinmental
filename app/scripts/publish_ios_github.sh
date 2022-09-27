#!/bin/bash
# check
if [ -n "$1" ]; then
    DISTRIBUTION_P12_PASSWORD=$1

else
    echo "load default config"
    DISTRIBUTION_P12_PASSWORD=""
fi

echo "Copy .env files to ./ios/fastlane/ folder"
# copy needed .env to ios fastlane folder
[ -f .env ] && cp .env ./ios/fastlane/.env
[ -f .env.default ] && cp .env.default ./ios/fastlane/.env.default

echo "Start ios Fastlane: testFlightGithub"
# start fastlane
cd ./ios && fastlane testFlightGithub certificate_password:${DISTRIBUTION_P12_PASSWORD}