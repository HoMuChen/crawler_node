const axios = require('axios');
const cheerio = require('cheerio');
const r = require('rethinkdb');

const { insert }= require('./utils/store');
const DB = 'Crawler'
const TABLE = 'gold'

const goldCrawlerExpressHandler = (req, res) => {
	run();

	res.send(`[GOLD] Start to fetch gold price at ${Date()}`)
}

function run() {
	axios.get('https://www.goldlegend.com/international.php')
		.then(result => cheerio.load(result.data))
			.then($ => $('script').get())
		.then(tags => tags[6].children[0].data)
		.then(string => {
			const re = /最新黃金價格：(\d+).(\d+)/g;
			const data = string.match(re);

			const doc = {};
			doc['id'] = r.now().toEpochTime()
			doc['price'] = Number(data[0].split('：')[1])
			
			console.log(`[GOLD] Insert gold price to db at ${Date()}`)
			insert(DB, TABLE, doc)
		})
}

module.exports = {
	goldCrawlerExpressHandler,
}
