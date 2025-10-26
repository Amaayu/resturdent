#!/bin/bash

# Exit on error
set -e

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install --only=production

# Install all client dependencies (including devDependencies) for build
echo "Installing client dependencies..."
cd ../client
npm install

# Build the client
echo "Building client..."
npm run build

# Clean up dev dependencies after build to reduce image size
echo "Cleaning up..."
npm prune --production

# Go back to server directory
cd ../server

# Start the server
echo "Starting server..."
node src/server.js
wait $SERVER_PID $CLIENT_PID