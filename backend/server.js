require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://expense-tracker-u7ud.vercel.app",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', expenseRoutes);  

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
      message: 'API is healthy',
      timestamp: new Date().toISOString(),
      mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('🔴 Error:', err.stack);
    res.status(err.status || 500).json({ 
      message: err.message || 'Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});