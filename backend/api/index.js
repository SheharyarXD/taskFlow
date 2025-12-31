const serverless = require("serverless-http");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const authRoutes = require("../routes/authRoutes");
const projectRoutes = require("../routes/projectRoutes");
const taskRoutes = require("../routes/taskRoutes");
const userRoutes = require("../routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// MongoDB caching
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Connect on cold start
connectDB().then(() => console.log("MongoDB connected")).catch(console.error);

module.exports.handler = serverless(app);
