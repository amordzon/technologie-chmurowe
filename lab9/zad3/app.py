import platform


def check_operating_system():
    system = platform.system()
    if system == "Windows":
        print("Running on Windows")
    elif system == "Linux":
        print("Running on Linux")
    elif system == "Darwin":
        print("Running on macOS")
    else:
        print("Unknown operating system")


check_operating_system()
