const express = require('express'),
  router = express.Router();

const rootPrefix = "../..",
  stocks = require(rootPrefix + '/app/controllers/stocks'),
  trades = require(rootPrefix + '/app/controllers/trades');

router.get('/stocks', stocks.list);
router.post('/trades/add', trades.add);
router.post('/trades/update', trades.update);

module.exports = router;