const rootPrefix = "../../..",
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  CommonValidator = require(rootPrefix + '/helpers/validators');

const mongoose = require('mongoose');
const Trade = mongoose.model('Trades');

class Add extends ServiceBase{
  constructor(params) {
    super();
    const oThis = this;
    
    oThis.stockId = params.stock_id;
    oThis.userId = params.user_id;
    oThis.quantity = params.quantity;
    oThis.buyPrice = params.buy_price;
  }
  
  /**
   *
   * @returns {Promise<unknown>}
   * @private
   */
  async _asyncPerform(){
    const oThis = this;
    
    await oThis._validateAndSanitize();
    
    await oThis._getUserObject();
    
    return oThis._addTrade();
  }
  
  async _validateAndSanitize(){
    const oThis = this;
    
    if(!CommonValidator.validateNonNegativeNumber(oThis.quantity)){
      return Promise.reject({
        error: 'param_validation_failed',
        paramter: 'quantity',
        reason: 'quantity should be a number greater than 0',
        code: 422
      })
    }
  
    if(!CommonValidator.validateNonNegativeDecimalUpto3Places(oThis.buyPrice)){
      return Promise.reject({
        error: 'param_validation_failed',
        paramter: 'average_buy_price',
        reason: 'average_buy_price should be a decimal number greater than 0 and should not have decimals more than 3',
        code: 422
      })
    }
  }
  
  async _getUserObject() {
    const oThis = this;
  }
  
  /**
   * Add trade
   *
   * @returns {Promise<unknown>}
   * @private
   */
  async _addTrade() {
    const oThis = this;
  
    let trade = new Trade({ user_id: oThis.userId, stock_id: oThis.stockId, shares_quantity: oThis.quantity, buy_price: oThis.buyPrice });
    
    // save model to database
    return new Promise(async function(onResolve, onReject){
      trade.save(function (err, trade) {
        if (err) {
          console.error(err);
          onReject({error: 'Error while saving data', code: 500})
        }
        console.log(trade._id, " saved to trade collection.");
        onResolve({success: true, code: 200, trade_id: trade._id})
      });
    })
  }
  
  async _updatePortfolio() {
    const oThis = this;
  }
}

module.exports = Add;