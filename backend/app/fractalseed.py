import requests
import json
import math
import os

params = { 'api_key': '19d84d5310f47c6e8eb0fd6e3e9104e0'}
warm = {0: ['ff4800', 'ff7900', 'ffaa00'],
1: ['cfdee7', 'cfdee7', 'ffc971']}
cool = {0: ['99e2b4', '56ab91', '248277'],
1: ['6247aa', '815ac0', '815ac0'],
2: ['0a369d', '5e7ce2', 'cfdee7'],
}

# fetch.py will store this information in /tmp/temperature.json. ideally we would write a cron job to do this but idk if github pages can handle it
def FetchTemperature(): # not for use in production
    r = requests.get("http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=" + params['api_key'])
    return math.floor(json.loads(r.text)["main"]["temp"])

def GetTemperature():
    temp = 0
    with open('/temp/temperature.txt') as f:
        temp = int(f.read())
    return temp

def scalecolor(temp):
    if (temp < 284):
        return cool[temp%(len(cool[1]))]
    return warm[temp%(len(warm[1]))]

def SeedMandlebrot(temp):
    return scalecolor(temp)

def SeedJulia(temp):
    xmin = 0
    xmax = 1.5
    ymin = 0
    ymax = 2
    tempmax = 338
    tempmin = 238
    scaledx = ((xmax-xmin)*(temp-tempmin))/((tempmax-tempmin)+xmin)
    scaledx = round(scaledx-1, 2)
    scaledy = ((ymax-ymin)*(temp-tempmin))/((tempmax-tempmin)+ymin)
    scaledy = round(scaledy-1, 2)
    color = scalecolor(temp)
    return [scaledx, scaledy, color]

def DailyFractal(temp):
    if (temp % 2 == 0):
        return "mandlebrot"
    return "julia"