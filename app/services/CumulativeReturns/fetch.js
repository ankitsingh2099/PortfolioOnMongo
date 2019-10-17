const rootPrefix = "../../..",
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  CommonValidator = require(rootPrefix + '/helpers/validators');

const mongoose = require('mongoose');
const User = mongoose.model('Users');

class Fetch extends ServiceBase{
  constructor(params) {
    super();
    const oThis = this;
    
    oThis.userId = params.user_id;
  }
  
  /**
   * Async Perform
   *
   * @returns {Promise<unknown>}
   * @private
   */
  async _asyncPerform(){
    const oThis = this;
    
    await oThis._validateAndSanitize();
    
    //await oThis._fetchStockId();
    
    return oThis._fetchReturns();
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
  }
  
  /**
   * Fetch Holdings
   *
   * @returns {Promise<unknown>}
   * @private
   */
  async _fetchReturns() {
    const oThis = this;
    
    return new Promise(async function(onResolve, onReject){
      User.findOne({user_id: oThis.userId},'user_id portfolio',{},function (err, user) {
        if (err) {
          console.error(err);
          onReject({error: 'Error while saving data', code: 500})
        }
        let returns = 0.0;
        for(let i = 0 ; i < user.portfolio.length ; i++){
          returns += ((100 - user.portfolio[i].average_buy_price) * user.portfolio[i].quantity)
        }
        onResolve({success: true, code: 200, result_type: 'cumulative_returns', cumulative_returns: returns})
      });
    })
  }
}

module.exports = Fetch;