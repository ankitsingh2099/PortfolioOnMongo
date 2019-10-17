const rootPrefix = '../..';

const mongoose = require('mongoose');

exports.get = function(req, res) {
  const FetchReturns = require(rootPrefix + '/app/services/CumulativeReturns/fetch');
  let fetchReturnsObj =  new FetchReturns(req.decodedParams);
  
  fetchReturnsObj.perform().then(function(rsp){
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