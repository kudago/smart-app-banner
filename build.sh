#!/bin/bash

VERSION=`cat version.txt`
VERSION_V=v${VERSION}

egrep -lRZi '"1.3.0"' --exclude='.travis.yml' . | xargs -0 -l sed -i "s/1.3.0/${VERSION}/g"

npm i
bower i

npm run eslint
npm run scsslint
#npm test
npm run build