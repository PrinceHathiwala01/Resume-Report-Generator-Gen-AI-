const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');

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
  res.status(200).send("OK");
});

module.exports =app;
