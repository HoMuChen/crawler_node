import os
import rethinkdb as r

SERVER  = os.environ.get('DB_HOST') or 'localhost'
PORT    = os.environ.get('DB_PORT') or 28015
DB      = os.environ.get('DB_DB') or 'Crawler'

def toRethinkdb(table, docs, server=SERVER, port=PORT, db=DB):
    conn = r.connect(server, port, db)
    r.table(table).insert(docs).run(conn)
    conn.close()

def toRethinkdbAndSelectKeys(table, docs, keys, server=SERVER, port=PORT, db=DB):
    conn = r.connect(server, port, db)
    
    for doc in docs:
        key_str = ''
        for key in keys:
            key_str += str(doc[key])

        doc['id'] = r.uuid( key_str )
    r.table(table).insert(docs).run(conn)
    conn.close()
