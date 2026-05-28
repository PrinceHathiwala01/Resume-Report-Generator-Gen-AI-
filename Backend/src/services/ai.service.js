const dotenv = require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

// ⚠️ IMPORTANT: use puppeteer-core on Render
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const apiKey =
  process.env.GOOGLE_GENAI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("Missing Gemini API key. Set GOOGLE_GENAI_API_KEY in .env");
}

const ai = new GoogleGenAI({ apiKey });

/* ---------------- INTERVIEW REPORT SCHEMA ---------------- */

const interviewReportSchema = z.object({
  matchScore: z.number(),
  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),
  behaviourQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),
  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      task: z.array(z.string()),
    })
  ),
  title: z.string(),
});

const interviewReportJsonSchema = z.toJSONSchema(interviewReportSchema);

/* ---------------- INTERVIEW REPORT ---------------- */

async function generateInterviewReport({
  resume,
  jobDescription,
  selfDescription,
}) {
  const prompt = `Generate an interview report:
Resume: ${resume}
Job description: ${jobDescription}
Self description: ${selfDescription}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: interviewReportJsonSchema,
    },
  });

  return JSON.parse(response.text);
}

/* ---------------- RESUME PDF ---------------- */

async function generateResumePdf({
  resume,
  selfDescription,
  jobDescription,
}) {
  const resumePdfSchema = z.object({
    html: z.string(),
  });

  const prompt = `
Generate a professional ATS-friendly resume in HTML.

Resume: ${resume}
Job description: ${jobDescription}
Self description: ${selfDescription}

Return ONLY JSON:
{ "html": "<html>...</html>" }

Rules:
- 1–2 pages max
- clean professional design
- human written tone
- ATS friendly
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(resumePdfSchema),
    },
  });

  const jsonContent = JSON.parse(response.text);

  if (!jsonContent.html) {
    throw new Error("AI did not return HTML");
  }

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}

/* ---------------- PDF GENERATOR (FIXED FOR RENDER) ---------------- */

async function generatePdfFromHtml(htmlContent) {
  let browser;

  try {
    const executablePath = await chromium.executablePath();

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm",
      },
    });

    return pdfBuffer;
  } catch (err) {
    console.error("PDF GENERATION ERROR:", err);
    throw err;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = {
  generateInterviewReport,
  generateResumePdf,
  generatePdfFromHtml,
};