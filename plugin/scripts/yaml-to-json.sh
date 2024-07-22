#!/usr/bin/bash
set -e

# Get the directory of the current script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Run the Python script using relative path
python3 "$DIR/python/yaml-to-json.py"