const { GoogleGenAI, Type } = require("@google/genai")
const chromium = require("@sparticuz/chromium")
// Check for Render, production, or other hosting environments
const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.RENDER) || Boolean(process.env.RAILWAY_ENVIRONMENT_NAME)
const isRender = Boolean(process.env.RENDER)
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const geminiModel="gemini-2.5-flash-lite"

const questionSchema = {
    type: Type.OBJECT,
    properties: {
        question: {
            type: Type.STRING,
            minLength: "12",
            description: "A realistic interview question."
        },
        intention: {
            type: Type.STRING,
            minLength: "20",
            description: "Why the interviewer asks this question."
        },
        answer: {
            type: Type.STRING,
            minLength: "40",
            description: "A strong answer strategy with concrete talking points."
        }
    },
    required: [ "question", "intention", "answer" ],
}

const interviewReportSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "The target job title."
        },
        matchScore: {
            type: Type.NUMBER,
            minimum: 0,
            maximum: 100,
            description: "A score between 0 and 100 showing how well the candidate matches the job."
        },
        technicalQuestions: {
            type: Type.ARRAY,
            minItems: "5",
            items: questionSchema,
            description: "At least 5 technical interview questions tailored to the job description and candidate profile."
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            minItems: "4",
            items: questionSchema,
            description: "At least 4 behavioral interview questions tailored to the job description and candidate profile."
        },
        skillGaps: {
            type: Type.ARRAY,
            minItems: "3",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: {
                        type: Type.STRING,
                        minLength: "2",
                        description: "A skill or experience area the candidate should improve."
                    },
                    severity: {
                        type: Type.STRING,
                        format: "enum",
                        enum: [ "low", "medium", "high" ],
                    }
                },
                required: [ "skill", "severity" ],
            },
            description: "At least 3 candidate skill gaps with severity."
        },
        preparationPlan: {
            type: Type.ARRAY,
            minItems: "5",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: {
                        type: Type.INTEGER,
                        minimum: 1,
                        description: "The day number in the preparation plan."
                    },
                    focus: {
                        type: Type.STRING,
                        minLength: "5",
                        description: "The main focus for this day."
                    },
                    tasks: {
                        type: Type.ARRAY,
                        minItems: "3",
                        items: {
                            type: Type.STRING,
                            minLength: "8"
                        },
                        description: "At least 3 concrete tasks for the day."
                    }
                },
                required: [ "day", "focus", "tasks" ],
            },
            description: "At least 5 days of preparation steps."
        },
    },
    required: [ "title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan" ],
    propertyOrdering: [ "title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan" ],
}

async function generateInterviewReport({ title, resume, selfDescription, jobDescription }) {


    const prompt = `Generate an interview report for a candidate with the following details:
                        Job Title: ${title}
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        Return complete, non-empty content:
                        - exactly 6 technicalQuestions
                        - exactly 5 behavioralQuestions
                        - exactly 4 skillGaps
                        - exactly 7 preparationPlan days
                        - each preparationPlan day must contain a tasks array with at least 3 tasks
`

    const response = await ai.models.generateContent({
        model: geminiModel,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema,
        }
    })

    return normalizeInterviewReport(JSON.parse(response.text), title)


}

function normalizeInterviewReport(report, fallbackTitle) {
    const normalized = {
        title: report.title || fallbackTitle,
        matchScore: Number(report.matchScore) || 0,
        technicalQuestions: report.technicalQuestions || [],
        behavioralQuestions: report.behavioralQuestions || report.behaviourQuestions || [],
        skillGaps: report.skillGaps || [],
        preparationPlan: (report.preparationPlan || []).map((day) => ({
            ...day,
            tasks: day.tasks || day.task || []
        }))
    }

    const invalidSections = []

    if (normalized.technicalQuestions.length === 0) invalidSections.push("technicalQuestions")
    if (normalized.behavioralQuestions.length === 0) invalidSections.push("behavioralQuestions")
    if (normalized.skillGaps.length === 0) invalidSections.push("skillGaps")
    if (normalized.preparationPlan.length === 0) invalidSections.push("preparationPlan")
    if (normalized.preparationPlan.some((day) => day.tasks.length === 0)) invalidSections.push("preparationPlan.tasks")

    if (invalidSections.length > 0) {
        throw new Error(`AI generated an incomplete interview report: ${invalidSections.join(", ")}`)
    }

    return normalized
}



async function generatePdfFromHtml(htmlContent) {
    let browser

    try {
        console.log("🔄 Starting PDF generation from HTML...")
        console.log("Environment:", isRender ? "Render" : isProduction ? "Production" : "Development")
        
        let launchOptions = {}
        
        if (isRender) {
            console.log("🎯 Using Render-optimized Puppeteer settings...")
            try {
                const execPath = await chromium.executablePath()
                launchOptions = {
                    args: [
                        ...chromium.args,
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--disable-dev-shm-usage",
                        "--disable-gpu",
                        "--disable-extensions",
                        "--single-process"
                    ],
                    defaultViewport: chromium.defaultViewport,
                    headless: chromium.headless,
                    executablePath: execPath,
                }
            } catch (pathError) {
                console.warn("⚠️ Could not get chromium path, using default launch:", pathError.message)
                launchOptions = {
                    args: [
                        ...chromium.args,
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--disable-dev-shm-usage",
                        "--disable-gpu",
                        "--disable-extensions",
                    ],
                    defaultViewport: chromium.defaultViewport,
                    headless: chromium.headless,
                }
            }
        } else if (isProduction) {
            console.log("🎯 Using production Puppeteer settings...")
            launchOptions = {
                args: [
                    ...chromium.args,
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage"
                ],
                defaultViewport: chromium.defaultViewport,
                headless: chromium.headless,
            }
        } else {
            console.log("🎯 Using development Puppeteer settings...")
            launchOptions = {
                headless: "new",
                args: ["--no-sandbox"]
            }
        }

        console.log("🚀 Launching Puppeteer browser...")
        browser = await puppeteer.launch(launchOptions)
        const page = await browser.newPage();
        
        // Set default navigation timeout
        page.setDefaultNavigationTimeout(60000)
        page.setDefaultTimeout(60000)
        
        console.log("📄 Setting page content...")
        try {
            await page.setContent(htmlContent, { waitUntil: "networkidle2" })
        } catch (contentError) {
            console.warn("⚠️ networkidle2 timeout, retrying with domcontentloaded...")
            // Fallback to domcontentloaded if networkidle2 times out
            await page.setContent(htmlContent, { waitUntil: "domcontentloaded" })
        }

        console.log("📑 Generating PDF from page...")
        const pdfBuffer = await page.pdf({
            format: "A4", 
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            },
            printBackground: true
        })

        console.log("✅ PDF generated successfully! Size:", pdfBuffer.length, "bytes")
        return pdfBuffer
    } catch (error) {
        console.error("❌ PDF generation error:", error.message)
        console.error("Stack trace:", error.stack)
        throw new Error(`Failed to generate PDF: ${error.message}`)
    } finally {
        if (browser) {
            console.log("🔒 Closing browser...")
            try {
                await browser.close()
            } catch (closeError) {
                console.warn("⚠️ Error closing browser:", closeError.message)
            }
        }
    }
}

async function generateResumePdf({ title, resume, selfDescription, jobDescription }) {

    const resumePdfSchema = {
        type: Type.OBJECT,
        properties: {
            html: {
                type: Type.STRING,
                description: "The complete HTML content of the resume which can be converted to PDF using puppeteer."
            }
        },
        required: [ "html" ]
    }

    const prompt = `Generate resume for a candidate with the following details:
                        Target Job Title: ${title}
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be lengthy then 1-1.5 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description..
                    `

    try {
        console.log("🤖 Requesting resume HTML from Gemini AI...")
        const response = await ai.models.generateContent({
            model: geminiModel,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: resumePdfSchema,
            }
        })              

        console.log("📝 Parsing AI response...")
        const jsonContent = JSON.parse(response.text)

        if (!jsonContent.html) {
            throw new Error("AI response does not contain HTML content")
        }

        if (!jsonContent.html.includes("<html") && !jsonContent.html.includes("<body")) {
            throw new Error("AI response HTML is invalid or incomplete")
        }

        console.log("✓ HTML received from AI, length:", jsonContent.html.length, "characters")
        
        // Clean up large resume/description text after AI generation to save memory
        const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

        return pdfBuffer
    } catch (error) {
        console.error("❌ Resume PDF generation failed:", error.message)
        console.error("Stack:", error.stack)
        throw error
    }

}

module.exports = { generateInterviewReport, generateResumePdf }
