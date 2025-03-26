#!/bin/bash

set -e

cd `dirname "$(readlink -f "$0")"`

git tag -d v1-beta
git push origin --delete v1-beta
git tag -a v1-beta -m "v1-beta"
git push origin v1-beta
