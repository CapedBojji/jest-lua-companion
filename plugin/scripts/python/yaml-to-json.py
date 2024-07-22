import os
import yaml
import json
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEvent, FileSystemEventHandler

# Directory to watch for YAML files (change this path as needed)
watch_directory = os.path.abspath('./src')

class YamlToJsonConverter(FileSystemEventHandler):
    def on_modified(self, event):
        if event.is_directory:
            return
        if event.src_path.endswith('.yaml') or event.src_path.endswith('.yml'):
            self.convert_yaml_to_json(event.src_path)

    def on_created(self, event):
        self.on_modified(event)
    
    def on_deleted(self, event: FileSystemEvent) -> None:
        if event.is_directory:
            return
        if event.src_path.endswith('.yaml') or event.src_path.endswith('.yml'):
            json_file_path = os.path.splitext(event.src_path)[0] + '.json'
            if os.path.exists(json_file_path):
                os.remove(json_file_path)
                print(f"Deleted {json_file_path}")


    def convert_yaml_to_json(self, yaml_file_path):
        # Construct the corresponding JSON file path in the same directory
        json_file_path = os.path.splitext(yaml_file_path)[0] + '.json'

        # Load YAML content
        with open(yaml_file_path, 'r') as yaml_file:
            yaml_content = yaml.safe_load(yaml_file)

        # Write JSON content
        with open(json_file_path, 'w') as json_file:
            json.dump(yaml_content, json_file, indent=4)

        print(f"Converted {yaml_file_path} to {json_file_path}")

    def print_event_path(self, event):
        print(f"Detected event: {event.event_type} - {os.path.abspath(event.src_path)}")

def start_file_watcher():
    event_handler = YamlToJsonConverter()
    observer = Observer()
    observer.schedule(event_handler, path=watch_directory, recursive=True)  # Set recursive=True to watch subdirectories
    observer.start()
    print(f"Watching directory {watch_directory} and its subdirectories for YAML file changes...")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    start_file_watcher()
