#!/bin/bash

# Configuration
DESCRIPTION="TypeScript Lambda Function"
FUNCTION_NAME="lambda-ts"
HANDLER="index.handler"
LAMBDA_MEMORY=128
LAMBDA_TIMEOUT=30
PROFILE=""
REGION="us-east-1"
ROLE_ARN="arn:aws:iam::427766509767:role/Lambda"
RUNTIME="nodejs22.x"
ZIP_FILE="function.zip"

# Parse command line arguments
CONFIG_ONLY=false
STAGING=false

for arg in "$@"
do
    if [[ "$arg" == "--config" ]]; then
        CONFIG_ONLY=true
    elif [[ "$arg" == "--staging" ]]; then
        STAGING=true
    elif [[ "$arg" =~ ^--profile=(.+)$ ]]; then
        PROFILE="--profile ${BASH_REMATCH[1]}"
    fi
done

# Adjust function name and description for staging
if [[ "$STAGING" == true ]]; then
    FUNCTION_NAME="${FUNCTION_NAME}-staging"
    DESCRIPTION="${DESCRIPTION} (Staging)"
fi

# Function to check if Lambda exists
lambda_exists() {
    aws lambda get-function --function-name ${FUNCTION_NAME} --region ${REGION} ${PROFILE} &> /dev/null
}

# Function to create new Lambda function
create_lambda_function() {
    echo "Creating new Lambda function..."
    aws lambda create-function \
        --description "${DESCRIPTION}" \
        --environment '{
            "Variables": {
                "NODE_ENV": "'$(if [[ "$STAGING" == true ]]; then echo "staging"; else echo "production"; fi)'"
            }
        }' \
        --function-name ${FUNCTION_NAME} \
        --handler ${HANDLER} \
        --memory-size ${LAMBDA_MEMORY} \
        --role ${ROLE_ARN} \
        --runtime ${RUNTIME} \
        --timeout ${LAMBDA_TIMEOUT} \
        --zip-file fileb://${ZIP_FILE} \
        ${PROFILE}
}

# Function to configure Lambda function
configure_lambda_function() {
    echo "Updating Lambda configuration..."
    aws lambda update-function-configuration \
        --description "${DESCRIPTION}" \
        --environment '{
            "Variables": {
                "NODE_ENV": "'$(if [[ "$STAGING" == true ]]; then echo "staging"; else echo "production"; fi)'"
            }
        }' \
        --function-name ${FUNCTION_NAME} \
        --handler ${HANDLER} \
        --memory-size ${LAMBDA_MEMORY} \
        --role ${ROLE_ARN} \
        --runtime ${RUNTIME} \
        --timeout ${LAMBDA_TIMEOUT} \
        ${PROFILE}
}

# Function to update Lambda code
update_lambda_code() {
    echo "Updating Lambda function code..."
    aws lambda update-function-code \
        --function-name ${FUNCTION_NAME} \
        --zip-file fileb://${ZIP_FILE} \
        --region ${REGION} \
        ${PROFILE}
}

# Function to build TypeScript project
build_project() {
    echo "Building TypeScript project..."
    yarn build
}

# Function to create deployment package
create_deployment_package() {
    echo "Creating deployment package..."
    cd dist
    zip -r ../${ZIP_FILE} .
    cd ..
}

# Function to clean up temporary files
cleanup() {
    echo "Cleaning up..."
    rm -f ${ZIP_FILE}
}

# Function to deploy Lambda
deploy_lambda() {
    if lambda_exists; then
        echo "Updating existing Lambda function..."
        update_lambda_code
    else
        echo "Creating new Lambda function..."
        create_lambda_function
    fi
}

# Main execution
if [ "$CONFIG_ONLY" = true ]; then
    configure_lambda_function
    exit 0
fi

build_project
create_deployment_package
deploy_lambda
cleanup

echo "Done! 🚀"