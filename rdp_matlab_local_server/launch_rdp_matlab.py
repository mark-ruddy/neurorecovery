import subprocess

def launch_matlab_remmina(rdp_conn):
    subprocess.call(f"remmina -c '{rdp_conn}'", shell=True)

def launch_matlab_rdp(url):
    # TODO: need option to find if OS is windows and not use remmina
    launch_matlab_remmina(url)
