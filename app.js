const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');
const { igCrawlerExpressHandler } = require('./ig');
const { bitCrawlerExpressHandler } = require('./bitPrice');
const { etherCrawlerExpressHandler } = require('./etherPrice');

const app = new express();

app.get('/ig/:tag', igCrawlerExpressHandler);
app.get('/bit', bitCrawlerExpressHandler);
app.get('/ether', etherCrawlerExpressHandler);

app.listen(config.apiPort, function() {
	console.log(`Api server is running on port ${config.apiPort}`);
})
