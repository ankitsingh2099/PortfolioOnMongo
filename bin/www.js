#!/usr/bin/env node

/**
 * Module dependencies
 */
const fs = require('fs'),
  join = require('path').join,
  mongoose = require('mongoose'),
  http = require('http');

const rootPrefix = '..',
  coreConstants = require(rootPrefix + '/coreConstants'),
  models = join(__dirname, rootPrefix + '/app/models');

const userName = coreConstants.MAIN_DB_MONGO_USER,
  password = coreConstants.MAIN_DB_MONGO_PASSWORD,
  endpoint = coreConstants.MAIN_DB_MONGO_HOST,
  database = coreConstants.MAIN_DB_MONGO_NAME;

let completeUri = "mongodb://" + userName + ":" + password + "@" + endpoint + '/' + database;
connect();

// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^.].*\.js$/))
  .forEach(file => require(join(models, file)));

const app = require(rootPrefix + '/app');

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PA_PORT);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

function listen() {
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  console.log('Error while starting server.',error.code);
  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES': {
      console.log('b_w_1', bind + ' requires elevated privileges');
      process.exit(1);
      break;
    }
    case 'EADDRINUSE': {
      console.log('b_w_2', bind + ' is already in use');
      process.exit(1);
      break;
    }
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

function connect() {
  mongoose.connection
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);
  return mongoose.connect(completeUri, { keepAlive: 1, useNewUrlParser: true, useUnifiedTopology: true });
}