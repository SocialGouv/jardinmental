#!/bin/bash -e
sed -i '' -e "s/[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}/$(ipconfig getifaddr en0)/g" .env.local
