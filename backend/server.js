const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

/* ---------- CORS ---------- */
app.use(cors());
app.use(express.json());

/* ---------- DB (cached for Vercel) ---------- */
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  cached.conn = await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log("MongoDB connected");
  return cached.conn;
}

/* ---------- CONNECT ON DEMAND ---------- */
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB connection failed" });
  }
});

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

/* ---------- HEALTH ---------- */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

/* ---------- EXPORT ---------- */
module.exports = serverless(app);
