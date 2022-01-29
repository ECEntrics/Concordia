#!/bin/bash

# Based on this post:
# https://engineering.brigad.co/only-deploy-services-impacted-by-changes-in-a-mono-repository-18f54b8ac109

APP=$1
# Jenkins should provide these in the environment by default
GIT_COMMIT=$2
GIT_PREVIOUS_COMMIT=$3
ROOT_FILES_AND_FOLDERS=${4:-"package.json" "yarn.lock" ".dockerignore" "docker" "jenkins"}

function join_by() {
  local IFS="$1"
  shift
  echo "$*"
}

function package_changed() {
  git diff --name-only "$COMMIT_RANGE" | grep -qE "^packages/concordia-$1/" && echo true || echo false
}

if [ "$GIT_COMMIT" == "$GIT_PREVIOUS_COMMIT" ]; then
  # Probably a manual re-run, set the range to just the last commit
  COMMIT_RANGE="$GIT_COMMIT"
else
  COMMIT_RANGE="$GIT_PREVIOUS_COMMIT...$GIT_COMMIT"
fi

ROOT_FILES_AND_FOLDERS_ARRAY=($ROOT_FILES_AND_FOLDERS)
ROOT_FILES_AND_FOLDERS_JOINED=$(join_by "|" ${ROOT_FILES_AND_FOLDERS_ARRAY[*]})

ROOT_FILES_CHANGED=$(git diff --name-only "$COMMIT_RANGE" | grep -qE "^($ROOT_FILES_AND_FOLDERS_JOINED)" && echo true || echo false)
IS_FORCE_BUILD=$(git log --oneline "$COMMIT_RANGE" | grep -qE "ci: force" && echo true || echo false)
APP_FILES_CHANGED=$(package_changed ${APP})

($IS_FORCE_BUILD || $ROOT_FILES_CHANGED || $APP_FILES_CHANGED) && echo 0 || echo 1
