const rootPrefix = "../../..",
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  CommonValidator = require(rootPrefix + '/helpers/validators');

const mongoose = require('mongoose');
const Trade = mongoose.model('Trades');

class Delete extends ServiceBase{
  constructor(params) {
    super();
    const oThis = this;
    
    oThis.tradeId = params.trade_id;
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
    
    return oThis._deleteTrade();
  }
  
  async _validateAndSanitize(){
    const oThis = this;
    
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
  async _deleteTrade() {
    const oThis = this;
    
    // save model to database
    return new Promise(async function(onResolve, onReject){
      Trade.findOneAndRemove({_id: oThis.tradeId}, {}, function (err, trade) {
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

module.exports = Delete;