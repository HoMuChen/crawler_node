const r = require('rethinkdb');

const config = require('../config');

function getConnection(db) {
	return r.connect({host: config.dbHost, port: config.dbPort, db: db})
}

async function insert(db, table, doc) {
	const conn = await getConnection(db);

	r.table(table).insert(doc).run(conn)
		.then(_ => conn.close())
		.catch(e => console.log(e))
}

async function insertAndSelectKeys(db, table, docs, keys) {
	const conn = await getConnection(db);
	
	if( Array.isArray(docs) ) {
		const data = docs
			.map(doc => {
				const keyStr = keys.reduce((cur, next) => {
				  cur += doc[next];
					return cur;
				}, "")
				doc.id = r.uuid(keyStr);
				return doc;
			})

		r.table(table).insert(data).run(conn, (err, result) => {
			if (err) console.log(err);
			conn.close();
		});
	}else {
		const keyStr = keys.reduce((cur, next) => {
		  cur += doc[next];
			return cur;
		}, "")

		docs.id = r.uuid(keyStr);

		r.table(table).insert(docs).run(conn)
			.catch(e => console.log(e))
	}
}

module.exports = {
	insert,
	insertAndSelectKeys,
}
