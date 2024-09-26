import { createRequire } from "module";
const require = createRequire(import.meta.url);
global.require = require;
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { GooglePaLMEmbeddings } from "@langchain/community/embeddings/googlepalm";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

async function getVectorStores(docs){
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  // created chunks from pdf
const splittedDocs = await splitter.createDocuments([docs]);
// console.log(splittedDocs)

const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGING_FACE_API , 
  model: 'sentence-transformers/all-MiniLM-L6-v2'// In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
});


// const embeddings = new GooglePaLMEmbeddings({apiKey:  process.env.GOOGLE_PALM_API_KEY})
// Load the docs into the vector store
// const vectorStore = await HNSWLib.fromDocuments(splittedDocs, embeddings);
// console.log(vectorStore)

const vectorStore = await FaissStore.fromDocuments(
  splittedDocs,
  embeddings
);

// const vectorStoreRetriever = vectorStore.asRetriever();
// const result = await vectorStore.similaritySearch("what is node",7);
return vectorStore
}

export default getVectorStores
