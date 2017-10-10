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

async function insertAndSelectKey(db, table, docs, key) {
	const conn = await getConnection(db);
	
	if( Array.isArray(docs) ) {
		docs
			.map(doc => {
				doc.id = r.uuid(doc[key]);
				return doc;
			})
			.forEach(doc => {
				r.table(table).insert(doc).run(conn)
					.catch(e => { console.log(e) })
			})
	}else {
		docs.id = r.uuid(docs[key]);

		r.table(table).insert(docs).run(conn)
			.catch(e => console.log(e))
	}
}

module.exports = {
	insert,
	insertAndSelectKey,
}
