const axios = require('axios');
const cheerio = require('cheerio');
const r = require('rethinkdb');

const { insertAndSelectKeys }= require('./utils/store');

const DB = 'Crawler'
const TABLE = 'legalFoundation'

const URL = 'http://www.twse.com.tw/fund/BFI82U'

const legalFCrawlerExpressHandler = (req, res) => {
	run();

	res.send(`[legalFoundation] Start to fetch at ${Date()}`)
}

function run() {
	//axios.get(`${URL}?response=json&dayDate=${date}&type=day`)
	//Get today data
	axios.get(URL)
		.then(result => result.data )
		.then(data => {
			if(data.stat !== 'OK') { throw new Error(`Skip this date ${data.stat}`) }

			const date = data.date;
			const docs = data.data.map(x => ({name: x[0], date: date, buyIn: x[1], sellOut: x[2], diff: x[3]}));

			return docs.filter(doc => doc.name !== '合計')
		})
		.then(docs => (docs.map(doc => {
			const data = {};
			data['name'] = doc['name'];
			data['date'] = `${doc['date'].slice(0, 4)}-${doc['date'].slice(4, 6)}-${doc['date'].slice(6, 8)}`
			data['buyIn'] = Number(doc['buyIn'].replace(',', '').replace(',', '').replace(',', ''))
			data['sellOut'] = Number(doc['sellOut'].replace(',', '').replace(',', '').replace(',', ''))
			data['diff'] = Number(doc['diff'].replace(',', '').replace(',', '').replace(',', ''))
			return data;
		})))
		.then(docs => {
			insertAndSelectKeys(DB, TABLE, docs, ['date', 'name']);
			console.log(`[LegalFoundation] Insert data to db at ${Date()}`)
		})
		.catch(e => console.log(e.message))
}

module.exports = {
	legalFCrawlerExpressHandler,
}
