const axios = require('axios');
const cheerio = require('cheerio');
const r = require('rethinkdb');

const { insert }= require('./utils/store');

const DB = 'Crawler'
const TABLE = 'taiex'

const taiexCrawlerExpressHandler = (req, res) => {
	const now = new Date();
	const month = (now.getMonth()+1 >= 10)
		? now.getMonth()+1
		: `0${now.getMonth()+1}`

	run(month);

	res.send(`[TAIEX] Start to fetch ${month}th taiex data at ${Date()}`)
}

function toWestDate(date) {
	const year = Number(date.split('/')[0]) + 1911;
	const month = date.split('/')[1];
	const day = date.split('/')[2];

	return `${year}-${month}-${day}`;
}

function toNumber(str) {
	return Number(str.replace(',', ''))
}

function run(month) {
	axios.get(`http:\/\/www.twse.com.tw/indicesReport/MI_5MINS_HIST?response=json&date=2018${month}01`)
		.then(result => result.data)
		.then(data => {
			if(!data.stat || data.stat !== 'OK') throw Error("[TAIEX] somthing wrong happended");

			const docs = data.data.map(row => {
				const date = new Date(toWestDate(row[0]));

				return {
					"id": date.getTime(),
					"date": toWestDate(row[0]),
					"opening_price": toNumber(row[1]),
					"highest_price": toNumber(row[2]),
					"lowest_price": toNumber(row[3]),
					"closing_price": toNumber(row[4]),
				};
			})

			console.log(`[TAIEX] Insert ${month}th month taiex data to db at ${Date()}`)
			insert(DB, TABLE, docs)
		})
		.catch(e => console.log(e.message))
}

module.exports = {
	taiexCrawlerExpressHandler,
}
