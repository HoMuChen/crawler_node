import time
from io import StringIO

import requests
import pandas as pd
from utils.store import toRethinkdbAndSelectKeys

TB = 'dispersion'

url ='http://smart.tdcc.com.tw/opendata/getOD.ashx?id=1-5'


response = requests.get(url, stream=True)

data = b''
for chunk in response.iter_content(chunk_size=512):
    if chunk:
        data += chunk
data = data.decode('UTF-8')
df = pd.read_csv(StringIO(data))

df['資料日期'] = df['資料日期'].apply(lambda x: "{}-{}-{}".format(str(x)[0:4], str(x)[4:6], str(x)[6:8]))
df = df.rename(columns={
    "資料日期": "date",
    "證券代號": "company_id",
    "持股分級": "level",
    "股數": 'volume',
    "人數": "headcount",
    "佔集保庫存數比例%": "percentage",
})

data = []
for row in df.iterrows():
    data.append(row[1].to_dict())

print("[**Dispersion**] Insert {} stock data in database".format(len(data)))
toRethinkdbAndSelectKeys(TB, data, ['company_id', 'date', 'level'])
