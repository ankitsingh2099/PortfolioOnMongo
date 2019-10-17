const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockSchema = new Schema({
  symbol: {type: String, default: '', trim: true, maxlength: 10},
  current_rate: {type: Number, default: 100},
  createdAt: { type: Date, default: Date.now }
});

StockSchema.methods =  {
  
  list: async function(options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return mongoose.model('Stocks').find(criteria)
      .populate('symbol')
      .exec(function(err, stocks){
      });
  }
};

mongoose.model('Stocks', StockSchema);