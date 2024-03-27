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
import getSummary from "./summarization.js"
let  parsedText = null
const port = 80;
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile('index.html'); // Serve the index.html from the public directory
});


const axios = require('axios');

async function callExternalApi(url, method = 'GET') {
  try {
    const response = await axios({
      method,
      url
    });

    return response.data;
  } catch (error) {
    // console.error('Error calling API:', error);
    throw error; // Re-throw for potential handling in calling code
  }
}


const upload = multer({ dest: "uploads/" }); // Specify a directory for temporary storage
let vectortore = null
app.post("/upload", upload.single("pdfFile"),async (req, res) => {
  const uploadedFile = req.file; // Get the uploaded file from the request object
  console.log( typeof  uploadedFile)
  if (uploadedFile) {
    console.log("File uploaded:", uploadedFile.filename);
    const dataBuffer = await fs.promises.readFile(uploadedFile.path); // Read file using fs.promises
    console.log(typeof dataBuffer)
     parsedText = await pdfParse(dataBuffer);

     console.log(parsedText.text)
     console.log(parsedText.text.trim().length)
    if(parsedText.text.trim().length === 0){
      let pdfPath = (uploadedFile.path).replace("\\","-")
      console.log("text extracted with ocr")
       callExternalApi(`http://127.0.0.1:3000/pdf_name/${pdfPath}`).then(res => {
        try {
          const data = fs.readFileSync("extractedText\\"+uploadedFile.filename+".txt", 'utf8');
          console.log(data);
        } catch (err) {
          console.error(err);
        }
       })
      
    }

        res.json({data:"vector-created"})
       
    //  })
  } else {
    console.error("No file uploaded!");
  }
  // res.json({data:"file-uploaded"})
 ; // Send a response to the client
});

      
app.get("/query", (req, res) => {
  let q = req.query["q"];
  if(q === "summerize this pdf"){
    getSummary(parsedText.text).then(result =>{res.json({response:result})})
    
  }
  else if (vectortore != null) {
    getResponse(vectortore, q).then((result) => {
      // console.log(result);
      res.json({response:result})
    });
  }
});

  
  
  app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
  });
  
