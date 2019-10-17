const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserPortfolioSchema = new Schema({
  stock_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Stocks'},
  quantity: {type: Number, default: 0},
  average_buy_price: {type: mongoose.Types.Decimal128, default: 0.0}
});

const UserSchema = new Schema({
  user_id: {type: Number},
  portfolio: {type: [UserPortfolioSchema]}
});

UserSchema.methods =  {
  
  list: async function(options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return mongoose.model('Users').find(criteria)
      .populate('user_id total_returns total_invested')
      .exec(function(err, stocks){
      });
  }
};

mongoose.model('Users', UserSchema);