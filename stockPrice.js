const r = require('rethinkdb');
const { spawn } = require('child_process');

const DB = 'Crawler'
const TABLE = 'stock_price'

const stockPriceHandler = (req, res) => {
	run();

	res.send(`Start to get stock price at ${Date()}`)
}

function run() {
	const py = spawn('python', ['stockPrice.py']);
	
	std = ''
	py.stdout.on('data', (data) => std += data);
	py.stderr.on('data', (data) => console.log(data.toString()))
	py.on('close', () => console.log(std))
}

module.exports = {
	stockPriceHandler,
}
