const express=require('express');
const interviewRouter = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const interviewController = require("../controllers/interview.controller");

/**
 * @route POST /api/interview
 * @desc Generate interview report
 * @access Private
 */

interviewRouter.post("/",authMiddleware.authUser,interviewController.generateInterviewReportController);

module.exports=interviewRouter;