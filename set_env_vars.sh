#!/usr/bin/env bash
# Core ENV Details
export SC_ENVIRONMENT='development'
export PA_PORT=3000

# Devops error logs framework
export SA_APP_NAME='smallcase-api';
export PA_DEVOPS_ENV_ID='dev1-sandbox';
export PA_DEVOPS_SERVER_IDENTIFIER='1111';

# Database details
export PA_MYSQL_CONNECTION_POOL_SIZE='3'

# mysql main db
export MAIN_DB_MONGO_HOST='localhost'
export MAIN_DB_MONGO_USER='root'
export MAIN_DB_MONGO_PASSWORD='root'
export MAIN_DB_MONGO_NAME='smallcase'
