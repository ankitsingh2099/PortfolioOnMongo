const rootPrefix = '../../..',
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  CommonValidator = require(rootPrefix + '/helpers/validators');

const mongoose = require('mongoose');
const Trade = mongoose.model('Trades');
const User = mongoose.model('Users');

class Delete extends ServiceBase {
  constructor(params) {
    super();
    const oThis = this;

    oThis.tradeId = params.trade_id;
    oThis.userId = params.user_id;

    oThis.stockId = null;
  }

  /**
   * Async Perform
   *
   * @returns {Promise<unknown>}
   * @private
   */
  async _asyncPerform() {
    const oThis = this;

    await oThis._validateAndSanitize();

    await oThis._fetchUserDetails();

    await oThis._deleteTrade();

    await oThis._updateUserPortfolio();

    return { success: true, code: 200, result_type: 'trade_id', trade_id: oThis.tradeId };
  }

  /**
   * Validate And Sanitize
   *
   * @returns {Promise<void>}
   * @private
   */
  async _validateAndSanitize() {
    const oThis = this;

    if (!CommonValidator.validateNonNegativeNumber(oThis.userId)) {
      return Promise.reject({
        success: false,
        error: 'param_validation_failed',
        parameter: 'user_id',
        reason: 'user id should be a number greater than 0',
        code: 422
      });
    }
  }

  /**
   * Fetch user details.
   *
   * @returns {Promise<unknown>}
   * @private
   */
  async _fetchUserDetails() {
    const oThis = this;

    return new Promise(async function(onResolve, onReject) {
      User.findOne({ user_id: oThis.userId }, 'user_id portfolio', {}, function(err, user) {
        if (err) {
          console.error(err);
          onReject({ success: false, error: 'Error while fetching data', code: 500 });
        }
        if (user) {
          oThis.user = user;
          oThis.userPortfolio = user.portfolio;
          onResolve();
        } else {
          return onReject({ success: false, error: 'Invalid user id', code: 422 });
        }
      });
    });
  }

  /**
   * Delete trade
   *
   * @returns {Promise<unknown>}
   * @private
   */
  async _deleteTrade() {
    const oThis = this;

    // save model to database
    return new Promise(async function(onResolve, onReject) {
      Trade.findOneAndRemove({ _id: oThis.tradeId }, {}, function(err, trade) {
        if (err) {
          console.error(err);
          return onReject({ success: false, error: 'Error while saving data', code: 500 });
        }
        if (CommonValidator.isVarNullOrUndefined(trade)) {
          return onReject({ success: false, error: 'Trade id not found in the system', code: 500 });
        }
        oThis.oldtradeSharesQuantity = parseInt(trade.shares_quantity);
        oThis.oldTradeBuyPrice = parseFloat(trade.buy_price).toFixed(3);
        oThis.stockId = trade.stock_id;
        onResolve({ success: true, code: 200, tradeId: trade._id });
      });
    });
  }

  /**
   * Update portfolio
   *
   * @returns {Promise<void>}
   * @private
   */
  async _updateUserPortfolio() {
    const oThis = this;
    for (let i = 0; i < oThis.userPortfolio.length; i++) {
      if (oThis.userPortfolio[i].stock_id.toString() == oThis.stockId.toString()) {
        let totalAmountForShares =
            parseFloat(oThis.userPortfolio[i].average_buy_price) * oThis.userPortfolio[i].quantity,
          oldTradeSharesAmount = oThis.oldtradeSharesQuantity * oThis.oldTradeBuyPrice,
          currentSharesQuantity = oThis.userPortfolio[i].quantity - oThis.oldtradeSharesQuantity,
          currentAverageBuyPrice = (totalAmountForShares - oldTradeSharesAmount) / currentSharesQuantity;
        oThis.userPortfolio[i].average_buy_price = parseFloat(currentAverageBuyPrice).toFixed(3);
        oThis.userPortfolio[i].quantity = currentSharesQuantity;
      }
    }
    oThis.user.portfolio = oThis.userPortfolio;

    return new Promise(async function(onResolve, onReject) {
      User.findOneAndUpdate({ user_id: oThis.userId }, oThis.user, {}, function(err, user) {
        if (err) {
          console.error(err);
          onReject({ error: 'Error while updating data', code: 500 });
        }
        console.log(' updated users portfolio.');
        onResolve({});
      });
    });
  }
}

module.exports = Delete;
