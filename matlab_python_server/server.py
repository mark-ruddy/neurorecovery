import os
import subprocess
import platform
from flask import Flask, jsonify
from os.path import join, dirname
from dotenv import load_dotenv

from spyder_ecg_plot import open_spyder_ecg_plot

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

@app.route('/launch_matlab_local')
def launch_matlab_local():
    launch_matlab_unix()
    response = jsonify("Matlab should be launched")
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Request-Headers", "X-Requested-With, accept, content-type")
    response.headers.add("Access-Control-Allow-Methods", "GET")
    return response

def launch_matlab_unix():
    subprocess.call('matlab -r "RunGui"', shell=True, cwd="D:\\Projects\\BCI_Stroke_Rehab\\temp3\\Temp3\\Temp3")   

@app.route('/launch_matlab_rdp')
def launch_matlab_rdp():
    if platform.system().lower() == "windows":
        subprocess.call(f'cmdkey /generic:"ec2-35-179-74-36.eu-west-2.compute.amazonaws.com" /user:"Administrator" /pass:"{RDP_PASS}"', shell=True);
        subprocess.call(windows_rdp_cmd, shell=True)
    else:
        subprocess.call(linux_rdp_cmd, shell=True)

    response = jsonify("Matlab RDP should be launched")
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Request-Headers", "X-Requested-With, accept, content-type")
    response.headers.add("Access-Control-Allow-Methods", "GET")
    return response

@app.route('/launch_matlab_quickassist')
def launch_matlab_quickassist():
    subprocess.call("quickassist", shell=True)
    # subprocess.call("explorer.exe shell:AppsFolder\\MicrosoftCorporationII.QuickAssist_8wekyb3d8bbwe!App", shell=True)

    response = jsonify("Matlab QuickAssist should be launched")
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Request-Headers", "X-Requested-With, accept, content-type")
    response.headers.add("Access-Control-Allow-Methods", "GET")
    return response

@app.route('/launch_spyder_ecg_plot')
def launch_spyder_ecg_plot():
    # NOTE: call function "open_spyder_ecg_plot" from spyder_ecg_plot.py file
    open_spyder_ecg_plot()

    response = jsonify("Spyder ECG plot should be launched")
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Request-Headers", "X-Requested-With, accept, content-type")
    response.headers.add("Access-Control-Allow-Methods", "GET")
    return response
