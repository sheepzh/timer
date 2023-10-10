#!/bin/bash

FOLDER=$(cd "$(dirname "$0")/.."; pwd)
TARGET_PATH="${FOLDER}/aaa"

tar -zcvf ${TARGET_PATH} \
 --exclude=dist*/ \
 --exclude=.git/ \
 --exclude=package-lock.json \
 --exclude=node_modules \
 --exclude=firefox_dev*/ \
 --exclude=market_packages \
 --exclude=aaa \
 ./

