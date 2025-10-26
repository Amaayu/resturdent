#!/bin/bash

# Exit on error
set -e

# Install server dependencies
cd server
npm install --only=production

# Install all client dependencies (including devDependencies) for build
cd ../client
npm install

# Build the client
npm run build

# Clean up dev dependencies after build to reduce image size
npm prune --production

# Start the server in the background
cd ../server
node src/server.js &
SERVER_PID=$!

# Serve the built files from the client
cd ../client
npx serve -s dist -l 5173 &
CLIENT_PID=$!

# Keep the script running
wait $SERVER_PID $CLIENT_PID
wait $SERVER_PID $CLIENT_PID