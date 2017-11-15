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
		docs
			.map(doc => {
				const keyStr = keys.reduce((cur, next) => {
				  cur += doc[next];
					return cur;
				}, "")
				doc.id = r.uuid(keyStr);
				return doc;
			})
			.forEach(doc => {
				r.table(table).insert(doc).run(conn)
					.catch(e => { console.log(e) })
			})
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
