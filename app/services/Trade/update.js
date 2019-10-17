const rootPrefix = "../../..",
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  CommonValidator = require(rootPrefix + '/helpers/validators');

const mongoose = require('mongoose');
const Trade = mongoose.model('Trades');

class Update extends ServiceBase{
  constructor(params) {
    super();
    const oThis = this;
    
    oThis.tradeId = params.trade_id;
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
    
    return oThis._updateTrade();
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
  async _updateTrade() {
    const oThis = this;
    
    let newObject = {
      user_id: oThis.userId,
      stock_id: oThis.stockId,
      shares_quantity: oThis.quantity,
      buy_price: oThis.buyPrice
    },
      tradeInstance = new Trade({});
    
    console.log('--tradeInstance-',tradeInstance);
    
    // save model to database
    return new Promise(async function(onResolve, onReject){
      tradeInstance.findByIdAndUpdate(oThis.tradeId, newObject, {upsert: true}, function (err, trade) {
        if (err) {
          console.error(err);
          onReject({error: 'Error while saving data', code: 500})
        }
        console.log(" updated trade collection.");
        onResolve({success: true, code: 200, tradeId: trade._id})
        
      });
    })
  }
  
  /**
   * Update portfolio
   *
   * @returns {Promise<void>}
   * @private
   */
  async _updatePortfolio(){
  
  }
}

module.exports = Update;