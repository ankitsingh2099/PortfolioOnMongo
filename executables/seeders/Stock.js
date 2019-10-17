const mongoose = require('mongoose');

const rootPrefix = "../..",
  mongooseConnectionProvider = require(rootPrefix + '/lib/providers/mongodb');


class SeedStocks{
  constructor() {
  
  }
  
  async perform() {
    mongooseConnectionProvider.getConnection().then(function(){
      const stocksBootstrap = require(rootPrefix + '/app/models/stocks'),
        StockModel = mongoose.model('Stocks');
    
      let stocks = [{symbol: 'TCS'}, {symbol: 'WIPRO'}, {symbol: 'GODREJIND'}];
    
      StockModel.collection.insert(stocks, function(err, docs){
        if(err){
          return console.error(err);
        } else {
          console.log('Stocks table seeded successfully');
        }
      })
    });
  }
}

new SeedStocks().perform().then(function(){
  process.exit(0);
}).catch(function(err){
  console.error('Error occurred');
  process.exit(1);
});