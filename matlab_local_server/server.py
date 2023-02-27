from flask import Flask, jsonify
from launch_matlab import *

app = Flask(__name__)

@app.route('/')
def index():
    return "The launch matlab server is running here. Visit /launch_matlab to launch matlab"

@app.route('/launch_matlab')
def launch_matlab_api():
    launch_matlab_unix()
    response = jsonify("Matlab should be launched")
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Request-Headers", "X-Requested-With, accept, content-type")
    response.headers.add("Access-Control-Allow-Methods", "GET")
    return response
