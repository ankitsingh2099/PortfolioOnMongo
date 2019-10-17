const express = require('express'),
  router = express.Router();

const rootPrefix = "../..",
  stocks = require(rootPrefix + '/app/controllers/stocks');

router.get('/stocks', stocks.list);

module.exports = router;