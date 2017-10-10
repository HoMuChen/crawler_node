const axios = require('axios');
const cheerio = require('cheerio');
const r = require('rethinkdb');

const { insert }= require('./utils/store');

const DB = 'Crawler'
const TABLE = 'ether'

const etherCrawlerExpressHandler = (req, res) => {
	run();

	res.send(`Start to get ether coin price at ${Date()}`)
}

function run() {
	axios.get('https://www.maicoin.com/zh-TW/')
		.then(result => {
			return cheerio.load(result.data);
		})
		.then($ => {
			return $('#latest_ether_price').text()
		})
		.then(priceStr => {
			const price = priceStr.split('$')[1];
			const doc = { price: price }

			doc['id'] = r.now().toEpochTime()

			console.log(`Insert ethercoin price to db at ${Date()}`)
			insert(DB, TABLE, doc);
		})
}

module.exports = {
	etherCrawlerExpressHandler,
}
