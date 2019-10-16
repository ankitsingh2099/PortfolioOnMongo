/**
 * Class for core constants.
 *
 * @class CoreConstants
 */
class CoreConstants {
  get environment() {
    return process.env.SC_ENVIRONMENT;
  }
  
  get APP_NAME() {
    return process.env.SA_APP_NAME;
  }
  
  // Main db
  get MAIN_DB_MONGO_HOST() {
    return process.env.MAIN_DB_MONGO_HOST;
  }
  
  get MAIN_DB_MONGO_USER() {
    return process.env.MAIN_DB_MONGO_USER;
  }
  
  get MAIN_DB_MONGO_PASSWORD() {
    return process.env.MAIN_DB_MONGO_PASSWORD;
  }
  
  get MAIN_DB_MONGO_NAME(){
    return process.env.MAIN_DB_MONGO_NAME;
  }
}

module.exports = new CoreConstants();
