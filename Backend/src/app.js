const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const multipleOrigin = [
    "https://resume-report-generator.vercel.app",
    "http://localhost:5173"
]
app.use(cors({
    origin: multipleOrigin,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`📨 [${req.method}] ${req.path}`);
    next();
});

const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

app.get("/health", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({ 
    status: "OK",
    database: dbConnected ? "✅ Connected" : "❌ Disconnected"
  });
});

// Debug endpoint to check users in database
app.get("/debug/users", async (req, res) => {
  try {
    const userModel = require('./model/user.model');
    const users = await userModel.find({}, { email: 1, username: 1, _id: 1 });
    res.status(200).json({
      count: users.length,
      users: users
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("❌ Unhandled error:", err.message);
    console.error("Stack:", err.stack);
    res.status(500).json({
        message: "Internal server error",
        error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message
    });
});

module.exports =app;
