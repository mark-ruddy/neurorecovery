import subprocess

def launch_matlab_unix():
    print("here")
    # subprocess.call("matlab -batch basic", shell=True)
    # subprocess.call("matlab -batch runner", shell=True)
    # subprocess.call("matlab -batch add", shell=True)
    subprocess.call('matlab -r "RunGui"', shell=True, cwd="D:\\Projects\\BCI_Stroke_Rehab\\temp3\\Temp3\\Temp3")
        

def main():
    print("running")
    launch_matlab_unix()

main()