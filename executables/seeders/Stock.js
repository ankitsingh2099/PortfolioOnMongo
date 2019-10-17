const mongoose = require('mongoose');

const rootPrefix = "../..",
  mongooseConnectionProvider = require(rootPrefix + '/lib/providers/mongodb');


class SeedStocks{
  constructor() {
  
  }
  
  /**
   * Perform
   *
   * @returns {Promise<unknown>}
   */
  async perform() {
    return new Promise(async function(onResolve, onReject){
      mongooseConnectionProvider.getConnection().then(function(){
        require(rootPrefix + '/app/models/stocks');
        const StockModel = mongoose.model('Stocks');
    
        let stocks = [{symbol: 'TCS'}, {symbol: 'WIPRO'}, {symbol: 'GODREJIND'}];
    
        StockModel.collection.insert(stocks, function(err, docs){
          if(err){
            console.error(err);
            onReject(err)
          } else {
            console.log('=====Stocks table seeded successfully=====');
            onResolve();
          }
        })
      });
    })
  }
}

new SeedStocks().perform().then(function(){
  process.exit(0);
}).catch(function(err){
  console.error('Error occurred');
  process.exit(1);
});