#!/bin/bash

FUNCTION_NAME="lambda-ts"
DEPLOYMENT_PACKAGE="deployment.zip"
CONFIG_FILE="lambda-config"

CONFIG_ONLY=false
STAGING=false

for arg in "$@"
do
  if [[ "$arg" == "--config" ]]; then
    CONFIG_ONLY=true
  elif [[ "$arg" == "--staging" ]]; then
    STAGING=true
  fi
done

if [[ "$STAGING" == true ]]; then
  FUNCTION_NAME="${FUNCTION_NAME}-staging"
  CONFIG_FILE="${CONFIG_FILE}-staging"
fi

if [[ "$CONFIG_ONLY" == true ]]; then
  aws lambda update-function-configuration \
    --cli-input-json file://scripts/$CONFIG_FILE.json
else
  yarn build

  cd dist
  zip -r ../scripts/$DEPLOYMENT_PACKAGE .
  cd ..

  aws lambda update-function-code \
    --function-name $FUNCTION_NAME \
    --zip-file fileb://scripts/$DEPLOYMENT_PACKAGE

  rm -f ./scripts/$DEPLOYMENT_PACKAGE
fi

echo "Done! 🚀"