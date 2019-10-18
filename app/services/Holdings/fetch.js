const rootPrefix = '../../..',
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  CommonValidator = require(rootPrefix + '/helpers/validators');

const mongoose = require('mongoose');
const User = mongoose.model('Users');
const Stock = mongoose.model('Stocks');

class Fetch extends ServiceBase {
  constructor(params) {
    super();
    const oThis = this;

    oThis.userId = params.user_id;

    oThis.stockIds = [];
    oThis.holdingsData = [];
  }

  /**
   * Async Perform.
   *
   * @returns {Promise<unknown>}
   * @private
   */
  async _asyncPerform() {
    const oThis = this;

    await oThis._validateAndSanitize();

    await oThis._fetchHoldings();

    await oThis._fetchStockSymbol();

    oThis._addStockSymbolInResponse();

    return { success: true, code: 200, result_type: 'portfolio', portfolio: oThis.holdingsData };
  }

  /**
   * Validate and Sanitize.
   *
   * @returns {Promise<never>}
   * @private
   */
  async _validateAndSanitize() {
    const oThis = this;

    if (!CommonValidator.validateNonNegativeNumber(oThis.userId)) {
      return Promise.reject({
        error: 'param_validation_failed',
        paramter: 'user_id',
        reason: 'user id should be a number greater than 0',
        code: 422
      });
    }
  }

  /**
   * Fetch Holdings.
   *
   * @returns {Promise<unknown>}
   * @private
   */
  async _fetchHoldings() {
    const oThis = this;

    return new Promise(async function(onResolve, onReject) {
      User.findOne({ user_id: oThis.userId }, 'user_id portfolio', {}, function(err, user) {
        if (err) {
          console.error(err);
          onReject({ error: 'Error while saving data', code: 500 });
        }
        let response = [];
        for (let i = 0; i < user.portfolio.length; i++) {
          let security = {};
          oThis.stockIds.push(mongoose.Types.ObjectId(user.portfolio[i].stock_id));
          security.stock_id = user.portfolio[i].stock_id;
          security.quantity = user.portfolio[i].quantity;
          security.average_buy_price = parseFloat(user.portfolio[i].average_buy_price).toFixed(3);
          response.push(security);
        }
        oThis.holdingsData = response;
        onResolve({ success: true, code: 200, result_type: 'portfolio', portfolio: response });
      });
    });
  }

  /**
   * Fetch stock symbol.
   *
   * @returns {Promise<unknown>}
   * @private
   */
  async _fetchStockSymbol() {
    const oThis = this;

    return new Promise(async function(onResolve, onReject) {
      Stock.find({ _id: { $in: oThis.stockIds } }, 'symbol', {}, function(err, stocks) {
        if (err) {
          console.error(err);
          return onReject({ success: false, error: 'Error while fetching data', code: 500 });
        }
        oThis.stockIdToSymbolHash = {};
        for (let i = 0; i < stocks.length; i++) {
          oThis.stockIdToSymbolHash[stocks[i]._id] = stocks[i].symbol;
        }
        onResolve();
      });
    });
  }

  /**
   * Add stock symbol in the holdings data hash.
   *
   * @private
   */
  _addStockSymbolInResponse() {
    const oThis = this;

    for (let i = 0; i < oThis.holdingsData.length; i++) {
      oThis.holdingsData[i].stock_symbol = oThis.stockIdToSymbolHash[oThis.holdingsData[i].stock_id];
    }
  }
}

module.exports = Fetch;
