const rootPrefix = "../..",
  mongooseConnectionProvider = require(rootPrefix + '/lib/providers/mongodb');

const schema = {
  symbol: String,
  current_rate: Number
};

class Stock {
  constructor() {
  
  }
  
  async getModel() {
    const oThis = this;
    
    let mongoConnection = await mongooseConnectionProvider.getConnection();
    
    oThis.stockSchema = new mongoConnection.Schema(schema);
    return mongoConnection.model('Stocks', oThis.stockSchema);
  }
}

module.exports = Stock;