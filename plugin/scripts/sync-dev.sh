#!/usr/bin/bash

# Exit immediately if any command exits with a non-zero status
set -e

# Set the NODE_ENV environment variable to development
export NODE_ENV=development

# Perform initial build
pnpm exec rbxtsc --verbose

# Function to kill background processes
cleanup() {
    echo "Killing background processes..."
    kill $pid1 $pid2
    exit 1
}

# Trap the termination signal and call cleanup
trap cleanup SIGINT SIGTERM

# Run command1 and command2 in parallel
pnpm exec rbxtsc --verbose --watch &
pid1=$!

rojo serve serve.project.json &
pid2=$!

# Wait for both commands to complete
wait $pid1
wait $pid2

echo "Both commands have completed."
