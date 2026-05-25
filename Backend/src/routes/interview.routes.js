const express=require('express');
const interviewRouter = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middleware/file.middleware");

/**
 * @route POST /api/interview
 * @desc Generate interview report
 * @access Private
 */

interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController);
interviewRouter.get("/:id",authMiddleware.authUser,interviewController.getInterviewReportByIdController);

module.exports=interviewRouter;
