import { createRequire } from "module";
const require = createRequire(import.meta.url);
global.require = require;
const { PromptTemplate } = require("@langchain/core/prompts");

require('dotenv').config()

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";







const model = new ChatGoogleGenerativeAI({
  model: "gemini-pro",
  apiKey:  process.env.GOOGLE_PALM_API_KEY,
  maxOutputTokens: 2048,
})

async function getResponse(vectorStore,question){
  console.log(question)
  console.log(vectorStore)
  

  const resultOne = await vectorStore.similaritySearch(question);
  let combinedText = '';

  for (const doc of resultOne) {
    combinedText += `* ${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]\n`;
  }
  let response = ""


  const promptText = `
  You are an expert assistant. You are provided with the following documents:

  ${combinedText}

  Only use the information provided in the above documents to answer the question below. Do not use any external knowledge or assumptions.

  Question: ${question}

  Please provide your response based solely on the given documents.
`;


  try {
  
    console.log(promptText);
     response = await model.invoke(promptText);
    console.log('AI Response:', response.content);
  } catch (err) {
    console.error('Error generating response:', err);
  }



return response.content
}

export default getResponse  