import { createRequire } from "module";
const require = createRequire(import.meta.url);
global.require = require;
import { GooglePaLM } from "@langchain/community/llms/googlepalm";
require('dotenv').config()
import { RetrievalQAChain } from "langchain/chains";



async function getResponse(vectorStoreRetriever,question){
  console.log(question)
  console.log(vectorStoreRetriever)
  const model = new GooglePaLM({apiKey:  process.env.GOOGLE_PALM_API_KEY})
const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever);
const answer = await chain.call({
  query: question
});

// Search for the most similar document
// const result = await vectorStore.similaritySearch("Concepts in mental health", 1);
console.log(answer.text);
return answer.text
}

export default getResponse  