#!/usr/bin/env bash
# Core ENV Details
export SC_ENVIRONMENT='development'
export PA_PORT=3000
export PA_DEBUG_ENABLED='1';
export PA_DOMAIN='http://pepodev.com:8080'
export PA_STORE_DOMAIN='http://store.pepodev.com:8080';
export PA_WEB_DOMAIN='http://test:testpasswd@pepodev.com:8080'
export PA_STORE_WEB_DOMAIN='http://test:testpasswd@store.pepodev.com:8080'
export PA_COOKIE_DOMAIN='.pepodev.com'

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
