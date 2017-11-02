import os
import rethinkdb as r

SERVER  = os.environ.get('DB_HOST') or 'localhost'
PORT    = os.environ.get('DB_PORT') or 28015
DB      = os.environ.get('DB_DB') or 'Crawler'

def toRethinkdb(table, doc, server=SERVER, port=PORT, db=DB):
    conn = r.connect(server, port, db)
    r.table(table).insert(doc).run(conn)
    conn.close()
