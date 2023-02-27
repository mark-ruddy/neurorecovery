import subprocess

def launch_matlab_unix():
    print("here")
    subprocess.call("matlab -batch run", shell=True, cwd='/home/mainuser/Documents')
