const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

const serverless = require("serverless-http");

const app = express();

// Configure CORS properly
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  maxAge: 86400, // Cache preflight for 24 hours
}));

app.use(express.json());

// Handle OPTIONS requests FIRST - before any DB connection
app.use((req, res, next) => {
  // Set CORS headers on all responses
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Max-Age', '86400');
  
  // Handle OPTIONS immediately - don't wait for DB
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// MongoDB connection caching for Vercel
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  // If already connected, return immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }
  
  // If connection is in progress, wait for it
  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (e) {
      cached.promise = null;
      throw e;
    }
  }
  
  // Start new connection
  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000, // Connection timeout
    };
    
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected');
        return mongoose;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
        cached.promise = null;
        throw err;
      });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  
  return cached.conn;
}

// Middleware to ensure DB connection - SKIP for OPTIONS and health check
app.use(async (req, res, next) => {
  // Skip DB connection for OPTIONS (already handled) and health check
  if (req.method === 'OPTIONS' || req.path === '/api/health') {
    return next();
  }
  
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    // Ensure CORS headers are set even on errors
    res.header('Access-Control-Allow-Origin', '*');
    res.status(500).json({ 
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint - no DB required
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Global error handler to ensure CORS headers on all errors
app.use((err, req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Export as serverless function
module.exports = serverless(app);

