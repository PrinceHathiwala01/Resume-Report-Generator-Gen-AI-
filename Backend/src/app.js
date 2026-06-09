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

module.exports =app;
