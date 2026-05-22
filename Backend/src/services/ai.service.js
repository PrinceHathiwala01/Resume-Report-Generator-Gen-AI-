const dotenv = require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
});

//DESCRIBE is the question that you want to ask to the AI or want to give the idea which filed you are talking about...
const interviewReportSchema = z.object({
    matchScore: z.number().describe("The match score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("Technical question can be asked in interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical question that can be asked in interview along with there intention and how to answer it"),
    behaviourQuestions: z.array(z.object({
        question: z.string().describe("Behaviour question can be asked in interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behaviour question that can be asked in interview along with there intention and how to answer it"),
    skillGaps:z.array(z.object({
        skill: z.string().describe("Skill gap can be asked in interview"),
        severity:z.enum(["low", "medium", "high"]).describe("The severity of skill gap"),
    })).describe("List of skill gaps in the cadidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structure"),
        task: z.array(z.string()).describe("List of tasks to be completed in this day in the preparation plan, e.g. implement a binary search tree")
    })).describe("A day-wise preparation plan for the candidate to prepare for the interview"),
})
async function genrateInterviewReport({ resume, jobDescription, selfDescription }) {

    const prompt = `Generate an interview report for a candidate with the following details:
    Resume: ${resume}
    Job describe: ${jobDescription}
    Self describe: ${selfDescription}`

    const response =await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents:prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(interviewReportSchema)
        }
    })

    console.log(JSON.parse(response.text))
}
module.exports = genrateInterviewReport;

//Just import the invokeGeminiAi function and call it in server.js, it will invoke the ai
//Content is the question that you want to ask to the AI inshort it is the prompt   

/*
If the error is raising that your quota has reached the limit then the free use of the ai is over you need to change it from the below link
https://ai.google.dev/gemini-api/docs/models

Few models
gemini-2.5-flash-lite
gemini-2.5

If the error is raising that your API key is invalid and it is leaked then we need to change the .env file means github is an open platform so anyone can use our link so 
we need to put the .env file in the .gitignore file so it will not be pushed to github
*/
