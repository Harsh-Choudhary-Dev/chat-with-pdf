import { loadSummarizationChain } from "langchain/chains";
import { GooglePaLM } from "@langchain/community/llms/googlepalm";
const { TokenTextSplitter } = require("langchain/text_splitter");
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
const { PromptTemplate } = require("@langchain/core/prompts");
// Replace with your preferred LLM provider


async function getSummary(documents){
  const splitter = new TokenTextSplitter({
    chunkSize: 5000,
    chunkOverlap: 250,
  });
  const docsSummary = await splitter.createDocuments([documents]);

  console.log(docsSummary)

  // Define the summarization prompt template
//   const promptTemplate = new PromptTemplate(`You are an expert in summarizing large documents. Please provide a concise and informative summary of the following text:

// {text}`);

const model = new GooglePaLM({apiKey:  process.env.GOOGLE_PALM_API_KEY})

//   // Create the summarization chain
  const summarizationChain = await loadSummarizationChain(model,{ type: "refine" });

//   // Summarize the document chunks and combine them
  const summaries = await summarizationChain.run(docsSummary);
  console.log(summaries)
  // const combinedSummary = summaries.reduce((acc, summary) => acc + summary, "");

  // Output the summary in the desired format
//   if (outputFormat === "text") {
//     console.log("Summary:", combinedSummary);
//   } else if (outputFormat === "html") {
//     // You might need an additional library like 'html-to-jména' to format the summary as HTML
//     const formattedSummary = convertSummaryToHtml(combinedSummary); // Replace with your HTML conversion function
//     console.log("Summary (HTML):", formattedSummary);
//   } else {
//     console.error(`Unsupported output format: ${outputFormat}`);
//   }
}

export default getSummary