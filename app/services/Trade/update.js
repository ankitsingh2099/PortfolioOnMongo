const rootPrefix = '../../..',
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  CommonValidator = require(rootPrefix + '/helpers/validators');

const mongoose = require('mongoose');
const Trade = mongoose.model('Trades');
const User = mongoose.model('Users');
const Stock = mongoose.model('Stocks');

class Update extends ServiceBase {
  constructor(params) {
    super();
    const oThis = this;

    oThis.tradeId = params.trade_id;
    oThis.stockSymbol = params.stock_symbol;
    oThis.userId = params.user_id;
    oThis.quantity = params.quantity;
    oThis.buyPrice = params.buy_price;
  }

  /**
   * Async Perform
   *
   * @returns {Promise<unknown>}
   * @private
   */
  async _asyncPerform() {
    const oThis = this;
    let promiseArray1 = [];

    await oThis._validateAndSanitize();

    promiseArray1.push(oThis._fetchStockId());

    promiseArray1.push(oThis._fetchUserDetails());

    await Promise.all(promiseArray1);

    await oThis._updateTrade();

    await oThis._updateUserPortfolio();

    return { success: true, code: 200, result_type: 'trade_id', trade_id: oThis.tradeId };
  }

  /**
   * Validate and Sanitize
   *
   * @returns {Promise<never>}
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

    if (!CommonValidator.validateNonNegativeNumber(oThis.quantity)) {
      return Promise.reject({
        success: false,
        error: 'param_validation_failed',
        parameter: 'quantity',
        reason: 'quantity should be a number greater than 0',
        code: 422
      });
    }
    oThis.quantity = parseInt(oThis.quantity);

    if (
      !CommonValidator.validateNonNegativeDecimalUpto3Places(oThis.buyPrice) &&
      !CommonValidator.validateNonNegativeInteger(oThis.buyPrice)
    ) {
      return Promise.reject({
        success: false,
        error: 'param_validation_failed',
        parameter: 'average_buy_price',
        reason: 'average_buy_price should be a decimal number greater than 0 and should not have decimals more than 3',
        code: 422
      });
    }
    oThis.buyPrice = parseFloat(oThis.buyPrice).toFixed(3);

    if (!CommonValidator.validateString(oThis.stockSymbol)) {
      return Promise.reject({
        success: false,
        error: 'param_validation_failed',
        parameter: 'stock_symbol',
        reason: 'stock_symbol should be a string',
        code: 422
      });
    }
  }

  /**
   * Fetch stock id.
   *
   * @returns {Promise<unknown>}
   * @private
   */
  async _fetchStockId() {
    const oThis = this;

    return new Promise(async function(onResolve, onReject) {
      Stock.findOne({ symbol: oThis.stockSymbol }, 'symbol', {}, function(err, stock) {
        if (err) {
          console.error(err);
          onReject({ success: false, error: 'Error while saving data', code: 500 });
        }
        if (stock) {
          oThis.stockId = stock._id;
          onResolve({ stock: stock });
        } else {
          onReject({ success: false, error: 'Invalid stock symbol', code: 422 });
        }
      });
    });
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
          onReject({ success: false, error: 'Invalid user id', code: 422 });
        }
      });
    });
  }

  /**
   * Update trade
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
    };

    return new Promise(async function(onResolve, onReject) {
      Trade.findOneAndUpdate({ _id: oThis.tradeId }, newObject, { upsert: true }, function(err, trade) {
        if (err) {
          console.error(err);
          onReject({ error: 'Error while saving data', code: 500 });
        }
        oThis.oldtradeSharesQuantity = parseInt(trade.shares_quantity);
        oThis.oldTradeBuyPrice = parseFloat(trade.buy_price).toFixed(3);
        onResolve({ success: true, code: 200, tradeId: trade._id });
      });
    });
  }

  /**
   * Update user portfolio
   *
   * @returns {Promise<void>}
   * @private
   */
  async _updateUserPortfolio() {
    const oThis = this;

    let alreadyBoughtShare = false;
    for (let i = 0; i < oThis.userPortfolio.length; i++) {
      if (oThis.userPortfolio[i].stock_id.toString() == oThis.stockId.toString()) {
        alreadyBoughtShare = true;
        let totalAmountForShares =
            parseFloat(oThis.userPortfolio[i].average_buy_price) * oThis.userPortfolio[i].quantity,
          oldTradeSharesAmount = oThis.oldtradeSharesQuantity * oThis.oldTradeBuyPrice,
          newTradeSharesAmount = oThis.quantity * oThis.buyPrice,
          currentSharesQuantity = oThis.userPortfolio[i].quantity - oThis.oldtradeSharesQuantity + oThis.quantity,
          currentAverageBuyPrice =
            (totalAmountForShares - oldTradeSharesAmount + newTradeSharesAmount) / currentSharesQuantity;
        oThis.userPortfolio[i].average_buy_price = parseFloat(currentAverageBuyPrice).toFixed(3);
        oThis.userPortfolio[i].quantity = currentSharesQuantity;
      }
    }

    if (!alreadyBoughtShare) {
      return Promise.reject({ success: false, error: 'Trade for give stock symbol does not exist.', code: 422 });
    } else {
      oThis.user.portfolio = oThis.userPortfolio;
    }

    return new Promise(async function(onResolve, onReject) {
      User.findOneAndUpdate({ user_id: oThis.userId }, oThis.user, {}, function(err, user) {
        if (err) {
          console.error(err);
          onReject({ success: false, error: 'Error while updating data', code: 500 });
        }
        console.log(' updated users portfolio.');
        onResolve({});
      });
    });
  }
}

module.exports = Update;
