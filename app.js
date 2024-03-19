import { createRequire } from "module";
const require = createRequire(import.meta.url);
global.require = require;
const multer = require('multer');
const fs = require('fs');
const path = require('path')
import getResponse from "./googleResponses.js"
const express = require('express');
const pdfParse = require('pdf-parse');
const app = express();
import getVectorStores from "./googleAI.js";
const port = 80;
import getSummary from "./summarization.js";



const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));
app.get('/home', (req, res) => {
  res.sendFile('index.html'); // Serve the index.html from the public directory
});


const upload = multer({ dest: "uploads/" }); // Specify a directory for temporary storage
let vectortore = null
app.post("/upload", upload.single("pdfFile"),async (req, res) => {
  const uploadedFile = req.file; // Get the uploaded file from the request object
  if (uploadedFile) {
    // console.log("File uploaded:", uploadedFile.filename);
    const dataBuffer = await fs.promises.readFile(uploadedFile.path); // Read file using fs.promises
    const parsedText = await pdfParse(dataBuffer);
    // console.log(parsedText.text)
    getSummary(parsedText.text).then(result => console.log("done"))
      // getVectorStores(parsedText.text).then(vectorStore=>{
        // vectortore = vectorStore
    //  })
  } else {
    console.error("No file uploaded!");
  }

  res.json({ message: "File upload received!" }); // Send a response to the client
});

      
// app.get("/query", (req, res) => {
//   let q = req.query["q"];
//   if (vectortore != null) {
//     getResponse(vectortore, q).then((result) => {
//       console.log(result);
//       res.json({response:result})
//     });
//   }
// });

  
  
  app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
  });
  
