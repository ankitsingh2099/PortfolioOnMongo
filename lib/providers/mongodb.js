const mongoose = require('mongoose');

const rootPrefix = "../..",
  coreConstants = require(rootPrefix + '/coreConstants');

let connection = null;

class mongooseConnectionProvider{
  constructor() {
  
  }
  
  async getConnection() {
    if(connection){
      return connection
    }
    const userName = coreConstants.MAIN_DB_MONGO_USER,
      password = coreConstants.MAIN_DB_MONGO_PASSWORD,
      endpoint = coreConstants.MAIN_DB_MONGO_HOST,
      database = coreConstants.MAIN_DB_MONGO_NAME;
    
    let completeUri = "mongodb://" + userName + ":" + password + "@" + endpoint + '/' + database,
      db = null;
    
    mongoose.connect(completeUri, { useNewUrlParser: true, autoIndex: false });
    
    return new Promise(async function(onResolve, onReject){
      db = mongoose.connection;
      db.on('error', function(err){
        onReject(err)
      });
      db.on('open', function() {
        console.log('----connected--');
        connection = mongoose;
        onResolve(connection);
      });
    })
  }
}

module.exports = new mongooseConnectionProvider();