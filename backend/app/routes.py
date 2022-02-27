from app import app
from flask import jsonify
from app.fractalseed import *

@app.route('/')
def home():
    return str(SeedJulia(250)[1])
@app.route('/GetJulia')
def GetJulia():
    temp = FetchTemperature()
    values = SeedJulia(temp)
    return jsonify({'x': values[0], 'y': values[1], 'color': values[2]})
@app.route('/GetMandlebrot')
def GetMandlebrot():
    temp = FetchTemperature()
    values = SeedMandlebrot(temp)
    return jsonify({'color': values[0]})
@app.route('/GetDailyFractal')
def GetDailyFractal():
    temp = FetchTemperature()
    if (DailyFractal(temp) == "julia"):
        values = SeedJulia(temp)
        return jsonify({'type': 'julia', 'x': values[0], 'y': values[1], 'color': values[2]})
    elif (DailyFractal(temp) == "mandlebrot"):
        values = SeedMandlebrot(temp)
        return jsonify({'type': 'mandlebrot', 'color': values[0]})