import os
import rethinkdb as r

SERVER  = os.environ.get('DB_HOST') or 'localhost'
PORT    = os.environ.get('DB_PORT') or 28015
DB      = os.environ.get('DB_DB') or 'Crawler'

def toRethinkdb(table, docs, server=SERVER, port=PORT, db=DB):
    conn = r.connect(server, port, db)
    r.table(table).insert(docs).run(conn)
    conn.close()

def toRethinkdbAndSelectTwoKeys(table, docs, keys, server=SERVER, port=PORT, db=DB):
    conn = r.connect(server, port, db)
    for doc in docs:
        doc['id'] = r.uuid( doc[keys[0]] + '-' + keys[1] )
    r.table(table).insert(docs).run(conn)
    conn.close()
