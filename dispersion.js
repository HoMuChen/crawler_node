const r = require('rethinkdb');
const { spawn } = require('child_process');

const dispersionHandler = (req, res) => {
	run();

	res.send(`Start to get dispersion data at ${Date()}`)
}

function run() {
	const py = spawn('python', ['dispersion.py']);
	
	std = ''
	py.stdout.on('data', (data) => std += data);
	py.stderr.on('data', (data) => console.log(data.toString()))
	py.on('close', () => console.log(std))
}

module.exports = {
	dispersionHandler,
}
