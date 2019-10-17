const express = require('express'),
  router = express.Router();

const rootPrefix = "../..",
  stocks = require(rootPrefix + '/app/controllers/stocks'),
  trades = require(rootPrefix + '/app/controllers/trades'),
  holdings = require(rootPrefix + '/app/controllers/holding'),
  cumulativeReturns = require(rootPrefix + '/app/controllers/cumulative_returns');

router.get('/stocks', stocks.list);
router.post('/trades/add', trades.add);
router.post('/trades/update', trades.update);
router.post('/trades/delete', trades.delete);

router.get('/holdings', holdings.get);

router.get('/cumulative-returns', cumulativeReturns.get);

module.exports = router;