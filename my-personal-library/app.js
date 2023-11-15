// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Create a new instance of express
const app = express();
app.use(express.json());

// Use CORS and BodyParser middleware
app.use(cors());
// Use morgan to log requests
app.use(morgan('dev'));
// Define a simple route for GET request on '/'
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Personal Library API.' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});
// Import routes
const bookRoutes = require('./routs/bookRoutes');
const userRoutes = require('./routs/userRoutes').router;
const test = require('./routs/test'); // Make sure './routs/test' is the correct path to your test.js file

// Use routes
app.use('/api', bookRoutes);
app.use('/api', userRoutes);
app.use('/api', test);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Export the app
module.exports = app;
