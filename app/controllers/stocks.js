const rootPrefix = '../..';

const mongoose = require('mongoose');
const Stock = mongoose.model('Stocks');

exports.list = function(req, res) {
  const StockList = require(rootPrefix + '/app/services/Stock/list');
  let stockListObj =  new StockList();
  
  stockListObj.perform().then(function(rsp){
    if(!rsp){
      res.status(500).json({});
    } else {
      if(rsp.error){
        res.status(rsp.code).json(rsp);
      } else {
        res.status(200).json(rsp);
      }
    }
  });
};