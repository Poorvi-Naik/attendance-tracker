// Import core libraries
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection function
const connectDB = require('./config/db');

// Connect to the database before starting the server
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());   // Parse incoming JSON data

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));


// Server setup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
