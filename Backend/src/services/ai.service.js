const dotenv = require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    technicalQuestions: z.array(z.object({
        question: z.string().description("Technical question can be asked in interview"),
        intention: z.string().description("The intention of interviewer behind asking this question"),
        answer: z.string().description("How to answer this question, what points to cover, what approach to take etc.")
    })).description("Technical question that can be asked in interview along with there intention and how to answer it"),
    behaviourQuestions: z.array(z.object({
        question: z.string().description("Behaviour question can be asked in interview"),
        intention: z.string().description("The intention of interviewer behind asking this question"),
        answer: z.string().description("How to answer this question, what points to cover, what approach to take etc.")
    })).description("Behaviour question that can be asked in interview along with there intention and how to answer it"),
    skillGaps:z.array(z.object({
        skill: z.string().description("Skill gap can be asked in interview"),
        severity:z.enum(["low", "medium", "high"]).description("The severity of skill gap"),
    })).description("Skill gap that can be asked in interview along with there intention and how to answer it"),
    preparationPlan: z.array(z.object({
        day: z.number().description("Day of the week"),
        focus: z.string().description("Focus of the day"),
        task: z.array(z.string()).description("Task to be done")
    })),
})
async function genrateInterviewReport({ resume, jobDescription, selfDescription }) {
    
}
module.exports = invokeGeminiAi;

//Just import the invokeGeminiAi function and call it in server.js, it will invoke the ai
//Content is the question that you want to ask

/*
If the error is raising that your quota has reached the limit then the free use of the ai is over you need to change it from the below link
https://ai.google.dev/gemini-api/docs/models

Few models
gemini-2.5-flash-lite
gemini-2.5

If the error is raising that your API key is invalid and it is leaked then we need to change the .env file mean github is an open platform so anyone can use our link so 
we need to put the .env file in the .gitignore file so it will not be pushed to github
*/
