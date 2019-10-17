const rootPrefix = "../../..",
  ServiceBase = require(rootPrefix + '/app/services/Base');

const mongoose = require('mongoose');
const Stock = mongoose.model('Stocks');

class List extends ServiceBase{
  constructor() {
    super();
  }
  
  async _asyncPerform(){
    const oThis = this;
    let stockMap = {};
    
    return new Promise( function(onResolve, onReject){
      Stock.find().then(notes => {
        console.log(notes);
        onResolve(notes);
      });
      
    });
  }
}

module.exports = List;