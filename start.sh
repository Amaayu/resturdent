#!/bin/bash

# Start the server in the background
cd server
npm install
npm start &

# Store the server process ID
SERVER_PID=$!

# Move to client directory and start the client
cd ../client
npm install
npm run dev

# When the client is stopped, also stop the server
kill $SERVER_PID 2>/dev/null
exit 0
