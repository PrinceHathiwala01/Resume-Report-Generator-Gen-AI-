const pdfParse = require("pdf-parse");
const mongoose = require("mongoose");
const generateInterviewReport = require("../services/ai.service");
const interviewReportModel = require("../model/interviewReport.model");

async function generateInterviewReportController(req, res) {
    try {
        const { selfDescription = "", jobDescription } = req.body;
        let resume = "";

        if (!jobDescription?.trim()) {
            return res.status(400).json({
                message: "Job description is required"
            });
        }

        if (req.file) {
            const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
            resume = resumeContent.text;
        }

        if (!resume.trim() && !selfDescription.trim()) {
            return res.status(400).json({
                message: "Either resume or self description is required"
            });
        }
    
        const interviewReportByAi = await generateInterviewReport({
            resume,
            selfDescription,
            jobDescription       
        });
    
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        })
    } catch (err) {
        console.log("Unable to generate interview report:", err);
        res.status(500).json({
            message: "Unable to generate interview report"
        });
    }
}

async function getInterviewReportByIdController(req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid interview report id"
            });
        }

        const interviewReport = await interviewReportModel.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        res.status(200).json({
            interviewReport
        });
    } catch (err) {
        console.log("Unable to fetch interview report:", err);
        res.status(500).json({
            message: "Unable to fetch interview report"
        });
    }
}

module.exports = { generateInterviewReportController, getInterviewReportByIdController }
