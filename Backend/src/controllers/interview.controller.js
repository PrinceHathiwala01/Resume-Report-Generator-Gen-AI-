const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../model/interviewReport.model")

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        const { title, selfDescription, jobDescription } = req.body

        if (!title || !jobDescription) {
            return res.status(400).json({
                message: "Job title and job description are required."
            })
        }

        if (!req.file && !selfDescription) {
            return res.status(400).json({
                message: "Upload a resume or add a self description."
            })
        }

        let resumeText = ""

        if (req.file?.buffer) {
            console.log("📄 Processing uploaded resume...")
            const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
            resumeText = resumeContent.text
            console.log("✓ Resume extracted, length:", resumeText.length)
        }

        console.log("🤖 Generating interview report from AI...")
        const interViewReportByAi = await generateInterviewReport({
            title,
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        console.log("💾 Saving interview report to database...")
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi,
            title
        })

        console.log("✅ Interview report generated successfully")
        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("❌ Error in generating interview report:", error.message)
        console.error("Stack:", error.stack)
        res.status(500).json({
            message: "Failed to generate interview report",
            error: process.env.NODE_ENV === "production" ? "Internal server error" : error.message
        })
    }

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        console.log("📥 PDF download request for interview:", interviewReportId)

        const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id })

        if (!interviewReport) {
            console.warn("⚠️ Interview report not found:", interviewReportId)
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { title, resume, jobDescription, selfDescription } = interviewReport

        console.log("🔄 Generating PDF for:", title)
        const pdfBuffer = await generateResumePdf({ title, resume, jobDescription, selfDescription })

        console.log("✅ PDF generated successfully, size:", pdfBuffer.length, "bytes")
        
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)
    } catch (error) {
        console.error("❌ Resume PDF generation error:", error.message)
        console.error("Full error:", error)
        res.status(500).json({
            message: "Failed to generate resume PDF",
            error: process.env.NODE_ENV === "production" ? "Internal server error" : error.message
        })
    }
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }
