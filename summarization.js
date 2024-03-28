import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-pro",
  apiKey:  process.env.GOOGLE_PALM_API_KEY,
  maxOutputTokens: 2048,
})

async function getSummary(documents){
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 4000,
    chunkOverlap: 250,
  });
  const docsSummary = await splitter.createDocuments([documents]);
  const summarizationChain = loadSummarizationChain(model, { type: "refine" });

//   // Summarize the document chunks and combine them
  const summaries = await summarizationChain.call({input_documents: docsSummary});
  return summaries.output_text
}

export default getSummary