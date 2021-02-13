#!/bin/bash

# Outputs to the stdout a deterministically generated integer in the range 0-4095. The integer is generated using the
# input strings and SHA1.
# Usage: hash_build_properties.sh <branch> <build_number>
# Inputs:
#   - branch:       the branch being build
#   - build_number  the incrementing number of the build

BRANCH=$1
BUILD_NUMBER=$2

STRING_TO_HASH="$BRANCH-$BUILD_NUMBER"
SHA1_SUM_HEX=$(sha1sum <<<"$STRING_TO_HASH")
SHA1_TRUNCATED_HEX=$(cut -c1-3 <<<"$SHA1_SUM_HEX")
HASHED_STRING=$((0x${SHA1_TRUNCATED_HEX}))

echo "$HASHED_STRING"
