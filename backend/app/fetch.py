import requests
import json
import math
import os
from flask import jsonify

params = { 'api_key': '19d84d5310f47c6e8eb0fd6e3e9104e0'}

r = requests.get("http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=" + params['api_key'])
with open('/temp/temperature.txt', 'w') as f:
    temp = str(math.floor(json.loads(r.text)["main"]["temp"]))
    f.write(str(temp))
    f.close()