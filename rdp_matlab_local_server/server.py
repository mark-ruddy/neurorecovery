import os
import subprocess
import platform
from flask import Flask, jsonify
from os.path import join, dirname
from dotenv import load_dotenv

app = Flask(__name__)

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)
REMMINA_PASS = os.environ.get("REMMINA_PASS")
RDP_PASS = os.environ.get("RDP_PASS")

windows_rdp_cmd = f"mstsc /v:ec2-35-179-74-36.eu-west-2.compute.amazonaws.com"
linux_rdp_cmd = f"remmina -c rdp://Administrator:{REMMINA_PASS}@ec2-35-179-74-36.eu-west-2.compute.amazonaws.com"

@app.route('/')
def index():
    return "The launch matlab RDP server is running here. Visit /launch_matlab_rdp to launch matlab"

@app.route('/launch_matlab_rdp')
def launch_rdp_matlab_api():
    if platform.system() == "windows":
        subprocess.call(f'cmdkey /generic:"ec2-35-179-74-36.eu-west-2.compute.amazonaws.com" /user:"Administrator" /pass:"{RDP_PASS}"', shell=True);
        launch_matlab_rdp(windows_rdp_cmd)
    else:
        launch_matlab_rdp(linux_rdp_cmd)

    response = jsonify("Matlab RDP should be launched")
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Request-Headers", "X-Requested-With, accept, content-type")
    response.headers.add("Access-Control-Allow-Methods", "GET")
    return response

def launch_matlab_rdp(cmd):
    # TODO: need option to find if OS is windows and not use remmina
    subprocess.call(cmd, shell=True)

# NOTE: For the eduroam connection, instead of a DNS name it'll be an IP addr like below, and matlab username, will need to encrypt the password too and add it to the .env file:
# rdp_conn = f"rdp://matlab:{REMMINA_PASS}@1.1.1.1"
