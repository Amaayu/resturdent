const { createServer } = require('@netlify/functions')
const express = require('express')
const serverless = require('serverless-http')
const path = require('path')

// Import your Express app from server/src/server.js
const app = require('../server/src/server')

// Create a new Express app for Netlify Functions
const netlifyApp = express()

// Mount your existing Express app
netlifyApp.use('/.netlify/functions/server', app)  // Path must match the redirect in netlify.toml

// Handle all other routes (for client-side routing)
netlifyApp.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
})

// Create the Netlify function handler
const handler = serverless(netlifyApp)

exports.handler = async (event, context) => {
  // You can do things like authentication here if needed
  const result = await handler(event, context)
  return result
}
