const dotenv = require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
});

async function invokeGeminiAi() {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: "Hello gemini! Explain what is interview?"
    })
    console.log(response.text);
}
module.exports = invokeGeminiAi;

//Just import the invokeGeminiAi function and call it in server.js, it will invoke the ai
//Content is the question that you want to ask
