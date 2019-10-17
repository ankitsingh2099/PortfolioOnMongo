const rootPrefix = '../..';

const mongoose = require('mongoose');

exports.get = function(req, res) {
  const FetchHoldings = require(rootPrefix + '/app/services/Holdings/fetch');
  let fetchHoldingsObj =  new FetchHoldings(req.decodedParams);
  
  fetchHoldingsObj.perform().then(function(rsp){
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