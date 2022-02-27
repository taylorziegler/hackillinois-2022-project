from app import app
import requests
import json
import math
import os

params = { 'api_key': '19d84d5310f47c6e8eb0fd6e3e9104e0'}

r = requests.get("http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=" + params['api_key'])
with open('/temp/temperature.tmp.json', 'w') as f:
    f.write(math.floor(json.loads(r.text)["main"]["temp"]))
os.rename('/temp/temperature.tmp.json', '/tmp/temperature.json')
# return math.floor(json.loads(r.text)["main"]["temp"])