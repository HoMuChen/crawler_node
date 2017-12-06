const axios = require('axios');
const cheerio = require('cheerio');
const r = require('rethinkdb');

const { insert }= require('./utils/store');

const DB = 'Crawler'
const TABLE = 'ltc'

const ltcCrawlerExpressHandler = (req, res) => {
	run();

	res.send(`[LTC] Start to get ltc coin price at ${Date()}`)
}

function run() {
	axios.get('https://www.maicoin.com/zh-TW/')
		.then(result => {
			return cheerio.load(result.data);
		})
		.then($ => {
			return $('#latest_ltc_price').text()
		})
		.then(priceStr => {
			const price = priceStr.split('$')[1].trim();
			const doc = { price: price }
	
			doc['id'] = r.now().toEpochTime()
			
			console.log(`[LTC] Insert ltccoin price to db at ${Date()}`)
			insert(DB, TABLE, doc)
		})
}

module.exports = {
	ltcCrawlerExpressHandler,
}
