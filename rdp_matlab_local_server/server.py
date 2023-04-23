import os
from flask import Flask, jsonify
from os.path import join, dirname
from dotenv import load_dotenv
from launch_rdp_matlab import *

app = Flask(__name__)

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)
REMMINA_PASS = os.environ.get("REMMINA_PASS")

rdp_conn = f"rdp://Administrator:{REMMINA_PASS}@ec2-16-170-168-47.eu-north-1.compute.amazonaws.com"

@app.route('/')
def index():
    return "The launch matlab RDP server is running here. Visit /launch_matlab_rdp to launch matlab"

@app.route('/launch_matlab_rdp')
def launch_rdp_matlab_api():
    launch_matlab_rdp(rdp_conn)

    response = jsonify("Matlab RDP should be launched")
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Request-Headers", "X-Requested-With, accept, content-type")
    response.headers.add("Access-Control-Allow-Methods", "GET")
    return response

# NOTE: For the eduroam connection, instead of a DNS name it'll be an IP addr like below, and matlab username, will need to encrypt the password too and add it to the .env file:
# rdp_conn = f"rdp://matlab:{REMMINA_PASS}@1.1.1.1"
