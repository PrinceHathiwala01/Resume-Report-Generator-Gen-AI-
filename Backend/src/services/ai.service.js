const dotenv = require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
});

async function invokeGeminiAi() {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Hello gemini! Explain what is interview?"
        })
        console.log(response.text);
    }catch (error) {
        console.log("Error in invoking gemini ai");

        if (error.status === 429) {
            console.log("Rate limit exceeded. Try again later.");
        }

        throw error;
    }
}

module.exports = invokeGeminiAi;

//Just import the invokeGeminiAi function and call it in server.js, it will invoke the ai
//Content is the question that you want to ask
