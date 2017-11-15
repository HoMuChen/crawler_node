const axios = require('axios');
const cheerio = require('cheerio');
const r = require('rethinkdb');

const { insertAndSelectKeys }= require('./utils/store');

const DB = 'Crawler'
const TABLE = 'foreignEX'

const foreignEXCrawlerExpressHandler = (req, res) => {
	const type = req.params.type;
	run(type);

	res.send(`Start to get ${type} foreignEX price at ${Date()}`)
}

function run(type) {
	axios.get(`http://rate.bot.com.tw/xrt/quote/l6m/${type}`)
		.then(result => cheerio.load(result.data) )
		.then($ => {
			const trs = $('.container table tbody tr');
			const data = []
			trs.each(function(i, tr) {
				const row = []
				$(this).find('td').each(function(i, td) {
					row.push($(this).text())
				})
				data.push(row)
			})
			return data
		})
		.then(data => {
			return data.map(row => {
				const doc ={};
				doc['date'] = row[0].replace(/\//g, "-")
				doc['type'] = type
				doc['cash_buying'] = Number(row[2])? Number(row[2]): 0;
				doc['cash_selling'] = Number(row[3])? Number(row[3]): 0;
				doc['spot_buying'] = Number(row[4])? Number(row[4]): 0;
				doc['spot_selling'] = Number(row[5])? Number(row[5]): 0;
				return doc;
			})
		})
		.then(data => {
			console.log(`Insert ${type} foreignEX price to db at ${Date()}`)
			insertAndSelectKeys(DB, TABLE, data, ['date', 'type'])
		})
		.catch(e => console.log(e))
}

module.exports = {
	foreignEXCrawlerExpressHandler,
}
