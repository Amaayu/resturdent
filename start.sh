#!/bin/bash

# Exit on error
set -e

# Start the server in the background
cd server
npm install --only=production
node src/server.js &
SERVER_PID=$!

# Build the client
cd ../client
npm install --only=production
npm run build

# Serve the built files
npx serve -s dist -l 5173 &
CLIENT_PID=$!

# Keep the script running
wait $SERVER_PID $CLIENT_PID