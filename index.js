'use strict';

// Main starting point of application
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const app = express();

// DB Setup
mongoose.connect('mongodb://localhost:auth/auth', () => {
  console.log('Connected to MongoDB');    
});

// App Setup
// Logging
app.use(morgan('combined'));
// Parse requests with JSON bodies
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server Setup
const port = process.env.port || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on ' + port);
