const rootPrefix = '../..';

exports.add = function(req, res) {
  const AddTrade = require(rootPrefix + '/app/services/Trade/add');
  let addTradeObj =  new AddTrade(req.decodedParams);
  
  addTradeObj.perform().then(function(rsp){
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

exports.update = function(req, res){
  const UpdateTrade = require(rootPrefix + '/app/services/Trade/update');
  let updateTradeObj = new UpdateTrade(req.decodedParams);
  
  updateTradeObj.perform().then(function(rsp){
    if(!rsp){
      res.status(500).json({});
    } else {
      if(rsp.error){
        res.status(rsp.code).json(rsp);
      } else {
        res.status(200).json(rsp);
      }
    }
  })
};