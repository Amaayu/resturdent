#!/bin/bash

# Exit on error
set -e

# Install server dependencies
cd server
npm install --only=production

# Install client dependencies
cd ../client
npm install --only=production

# Build the client
npm run build

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