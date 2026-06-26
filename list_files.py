import os

def list_files(directory):
    try:
        files = os.listdir(directory)
        print(f"Files in {directory}:")
        for file in files:
            print(file)
    except FileNotFoundError:
        print(f"The directory '{directory}' does not exist.")

if __name__ == '__main__':
    server_folder = 'path/to/server/folder'  # Replace with the actual path to your server folder
    list_files(server_folder)
