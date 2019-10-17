const express = require('express'),
  router = express.Router();

const rootPrefix = "../..",
  stocks = require(rootPrefix + '/app/controllers/stocks'),
  trades = require(rootPrefix + '/app/controllers/trades'),
  holdings = require(rootPrefix + '/app/controllers/holding');

router.get('/stocks', stocks.list);
router.post('/trades/add', trades.add);
router.post('/trades/update', trades.update);
router.post('/trades/delete', trades.delete);

router.get('/holdings', holdings.get);

module.exports = router;