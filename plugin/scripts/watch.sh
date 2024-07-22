#!/bin/bash
# Exit on error
set -e

# Function to clean up on exit
cleanup() {
    echo "Cleaning up..."
    # Send TERM signal to the process group to terminate both serve and watch-dev
    kill -- -$$
}

# Trap termination signals
trap cleanup EXIT

# Install dependencies
pnpm install

# Compile the project
pnpm run build-dev 

# Run serve in the background
pnpm run serve &

# Run watch-dev in the background
pnpm run watch-dev &

# Wait for all background jobs to finish
wait
