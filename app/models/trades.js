const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TradeSchema = new Schema({
  user_id: {type: Number},
  stock_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Stocks'},
  shares_quantity: {type: Number, default: 0},
  buy_price: { type: mongoose.Types.Decimal128, default: 0.0 }
});

TradeSchema.methods =  {
  
  list: async function(options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return mongoose.model('Trades').find(criteria)
      .populate('user_id stock_id shares_quantity weighted_average')
      .exec(function(err, userstocks){
      });
  }
};

mongoose.model('Trades', TradeSchema);