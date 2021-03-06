const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');
const { igCrawlerExpressHandler } = require('./ig');
const { bitCrawlerExpressHandler } = require('./bitPrice');
const { etherCrawlerExpressHandler } = require('./etherPrice');
const { ltcCrawlerExpressHandler } = require('./ltcPrice');
const { stockPriceHandler } = require('./stockPrice');
const { dispersionHandler } = require('./dispersion');
const { foreignEXCrawlerExpressHandler } = require('./foreignEX');
const { legalFCrawlerExpressHandler } = require('./legalFoundation');
const { taiexCrawlerExpressHandler } = require('./taiex');
const { goldCrawlerExpressHandler } = require('./gold');

const app = new express();

app.get('/ig/:tag',            igCrawlerExpressHandler);
app.get('/bit',                bitCrawlerExpressHandler);
app.get('/ether',              etherCrawlerExpressHandler);
app.get('/ltc',                ltcCrawlerExpressHandler);
app.get('/stock_price',        stockPriceHandler);
app.get('/dispersion',         dispersionHandler);
app.get('/foreign_ex/:type',   foreignEXCrawlerExpressHandler);
app.get('/legalFoundation',    legalFCrawlerExpressHandler);
app.get('/taiex',              taiexCrawlerExpressHandler);
app.get('/gold',               goldCrawlerExpressHandler);

app.listen(config.apiPort, function() {
	console.log(`Api server is running on port ${config.apiPort}`);
})
