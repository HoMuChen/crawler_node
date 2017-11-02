import time
from io import StringIO

import requests
import pandas as pd
from utils.store import toRethinkdb

TB = 'stock_price'

url ='http://www.twse.com.tw/exchangeReport/STOCK_DAY_ALL?response=csv'

response = requests.get(url, stream=True)
data = b''
for chunk in response.iter_content(chunk_size=512):
    if chunk:
        data += chunk
data = data.decode('ms950')

df = pd.read_csv(StringIO(data), skiprows=1)
df = df.drop('Unnamed: 10', axis=1)
df = df.dropna()
df = df[~df['證券代號'].str.contains('=')]

df['證券代號'] = df['證券代號'].str.strip()
df['證券名稱'] = df['證券名稱'].str.strip()
df['成交股數'] = df['成交股數'].apply(lambda x: float(x.replace(',', '')))
df['成交金額'] = df['成交金額'].apply(lambda x: float(x.replace(',', '')))
df['開盤價'] = df['開盤價'].apply(lambda x: float(x.replace(',', '')))
df['最高價'] = df['最高價'].apply(lambda x: float(x.replace(',', '')))
df['最低價'] = df['最低價'].apply(lambda x: float(x.replace(',', '')))
df['收盤價'] = df['收盤價'].apply(lambda x: float(x.replace(',', '')))
df['漲跌價差'] = df['漲跌價差'].apply(lambda x: float(x.replace(',', '').replace('X', '')))
df['成交筆數'] = df['成交筆數'].apply(lambda x: float(x.replace(',', '')))
df['date'] = time.strftime("%Y-%m-%d", time.gmtime())

df = df.rename(columns={
    "證券代號": "comany_id",
    "證券名稱": "c_name",
    "成交股數": "total_trading_volumn",
    "成交金額": 'total_trading_money',
    "開盤價": "opening_price",
    "最高價": "highest_price",
    "最低價": "lowest_price",
    "收盤價": "closing_price",
    "漲跌價差": "diff",
    "成交筆數": "total_trading_count"
})
data = []
for row in df.iterrows():
    data.append(row[1].to_dict())

print("[**Stock pirce**] Insert {} stock data in database".format(len(data)))
toRethinkdb(TB, data)
