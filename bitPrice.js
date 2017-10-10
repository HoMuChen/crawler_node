const axios = require('axios');
const cheerio = require('cheerio');
const r = require('rethinkdb');

const { insert }= require('./utils/store');

const DB = 'Crawler'
const TABLE = 'bit'

const bitCrawlerExpressHandler = (req, res) => {
	run();

	res.send(`Start to get bit coin price at ${Date()}`)
}

function run() {
	axios.get('https://www.maicoin.com/zh-TW/')
		.then(result => {
			return cheerio.load(result.data);
		})
		.then($ => {
			return $('#latest_bitcoin_price').text()
		})
		.then(priceStr => {
			const price = priceStr.split('$')[1];
			const doc = { price: price }
	
			doc['id'] = r.now().toEpochTime()
			
			console.log(`Insert bitcoin price to db at ${Date()}`)
			insert(DB, TABLE, doc)
		})
}

module.exports = {
	bitCrawlerExpressHandler,
}
