#!/bin/bash

# Exit on error
set -e

# Print current directory for debugging
echo "=== Current directory: $(pwd) ==="

# Install server dependencies
echo "=== Installing server dependencies... ==="
cd server
npm install --only=production

# Go to client directory
cd ../client

# Install client dependencies
echo "=== Installing client dependencies... ==="
npm install

# Build the client
echo "=== Building client... ==="
npm run build

# Verify build directory
echo "=== Build directory contents: ==="
ls -la dist/

# Clean up dev dependencies after build to reduce image size
echo "=== Cleaning up... ==="
npm prune --production

# Go back to project root
echo "=== Current directory before starting server: $(pwd) ==="
cd ..

# Set NODE_ENV to production if not set
export NODE_ENV=production

# Start the server from the project root
echo "=== Starting server... ==="
node server/src/server.js
wait $SERVER_PID $CLIENT_PID