const rootPrefix = "../../..",
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  CommonValidator = require(rootPrefix + '/helpers/validators');

const mongoose = require('mongoose');
const Trade = mongoose.model('Trades');
const User = mongoose.model('Users');
const Stock = mongoose.model('Stocks');

class Add extends ServiceBase{
  /**
   * Constructor to add trade.
   *
   * @param {object} params
   * @param {object} params.stock_symbol
   * @param {number} params.user_id
   * @param {number} params.quantity
   * @param {string} params.buy_price
   *
   * @augments ServiceBase
   *
   * @constructor
   */
  constructor(params) {
    super();
    const oThis = this;
    
    oThis.stockSymbol = params.stock_symbol;
    oThis.userId = params.user_id;
    oThis.quantity = params.quantity;
    oThis.buyPrice = params.buy_price;
  
    oThis.stockId = null;
  }
  
  /**
   * Async Perform
   *
   * @returns {Promise<unknown>}
   * @private
   */
  async _asyncPerform(){
    const oThis = this;
    
    let promiseArray = [];
    
    await oThis._validateAndSanitize();
    
    await oThis._fetchStockId();

    promiseArray.push(oThis._getUserAndUpdateObject());

    promiseArray.push(oThis._addTrade());

    await Promise.all(promiseArray);

    return Promise.resolve({success: true, code: 200, result_type: 'trade_id', trade_id: oThis.tradeId})
  }
  
  /**
   * Validate and Sanitize
   *
   * @returns {Promise<never>}
   * @private
   */
  async _validateAndSanitize(){
    const oThis = this;
  
    if(!CommonValidator.validateNonNegativeNumber(oThis.userId)){
      return Promise.reject({
        error: 'param_validation_failed',
        paramter: 'user_id',
        reason: 'user id should be a number greater than 0',
        code: 422
      })
    }
    
    if(!CommonValidator.validateNonNegativeNumber(oThis.quantity)){
      return Promise.reject({
        error: 'param_validation_failed',
        parameter: 'quantity',
        reason: 'quantity should be a number greater than 0',
        code: 422
      })
    }
    oThis.quantity = parseInt(oThis.quantity);
    
    if(!CommonValidator.validateNonNegativeDecimalUpto3Places(oThis.buyPrice) && !CommonValidator.validateNonNegativeInteger(oThis.buyPrice)){
      return Promise.reject({
        error: 'param_validation_failed',
        parameter: 'average_buy_price',
        reason: 'average_buy_price should be a decimal number greater than 0 and should not have decimals more than 3',
        code: 422
      })
    }
    oThis.buyPrice = parseFloat(oThis.buyPrice).toFixed(3);
    
    if(!CommonValidator.validateString(oThis.stockSymbol)){
      return Promise.reject({
        error: 'param_validation_failed',
        parameter: 'stock_symbol',
        reason: 'stock_symbol should be a string',
        code: 422
      })
    }
  }
  
  /**
   * Fetch stock id.
   *
   * @returns {Promise<unknown>}
   * @private
   */
  async _fetchStockId(){
    const oThis = this;
    
    return new Promise(async function(onResolve, onReject){
      Stock.findOne({symbol: oThis.stockSymbol}, 'symbol', {}, function(err, stock) {
        if(err){
          console.error(err);
          onReject({error: 'Error while saving data', code: 500})
        }
        if(stock){
          oThis.stockId = stock._id;
          onResolve({stock: stock});
        } else {
          onReject({error: 'Invalid stock symbol', code: 422})
        }
      })
    })
  }
  
  /**
   * Get User and Update the user's portfolio.
   *
   * @returns {Promise<unknown>}
   * @private
   */
  async _getUserAndUpdateObject() {
    const oThis = this;
    
    return new Promise(async function(onResolve, onReject){
      User.findOne({user_id: oThis.userId},'user_id portfolio',{},function (err, user) {
        if (err) {
          console.error(err);
          onReject({error: 'Error while saving data', code: 500})
        }
        let existingInPortfolio = false;
        for(let i = 0 ; i < user.portfolio.length ; i++){
          console.log("=user.portfolio[i].stock_id==",user.portfolio[i].stock_id);
          console.log("==oThis.stockId==",oThis.stockId);
          if(user.portfolio[i].stock_id.toString() == oThis.stockId.toString()){
            existingInPortfolio = true;
            let existingQuantity = parseInt(user.portfolio[i].quantity),
              existingAvgPrice = parseFloat(user.portfolio[i].average_buy_price);
            user.portfolio[i].quantity += parseInt(oThis.quantity);
            
            let newAvgBuyPrice = (parseFloat(existingQuantity * existingAvgPrice) + parseFloat(oThis.buyPrice * oThis.quantity)) / (existingQuantity + oThis.quantity)
            user.portfolio[i].average_buy_price = parseFloat(newAvgBuyPrice).toFixed(3);
          }
        }
        if(!existingInPortfolio){
          let portfolio = {
            stock_id: oThis.stockId,
            quantity: oThis.quantity,
            average_buy_price: oThis.buyPrice
          };
          user.portfolio.push(portfolio);
        }
        User.findOneAndUpdate({user_id: oThis.userId}, user, {}, function (err, user){
          if (err) {
            console.error(err);
            onReject({error: 'Error while updating portfolio data', code: 500})
          }
          onResolve();
        });
      });
    })
  }
  
  /**
   * Add trade
   *
   * @returns {Promise<unknown>}
   * @private
   */
  async _addTrade() {
    const oThis = this;
  
    let trade = new Trade({
      user_id: oThis.userId,
      stock_id: oThis.stockId,
      shares_quantity: oThis.quantity,
      buy_price: oThis.buyPrice
    });
    
    // save model to database
    return new Promise(async function(onResolve, onReject){
      trade.save(function (err, trade) {
        if (err) {
          console.error(err);
          onReject({error: 'Error while saving data', code: 500})
        }
        oThis.tradeId = trade._id;
        onResolve()
      });
    })
  }
}

module.exports = Add;