const Tesseract = require('tesseract.js');
import { fromBuffer } from 'pdf2pic';

const options = {
    density: 300,
    saveFilename: "untitled",
    savePath: "pdfPagesImages",
    format: "png",
    width: 1080,
    height: 1080
  };

  
  async function getText(imageName,pageCount) {
    let imageText = ""
    try {
      for(let i = 1;i<=pageCount;i++){
        const imagePath = 'pdfPagesImages/'+imageName+"."+ +i+".png";
         const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
          lang: 'eng',
          psm: 'single_block',
        });
    
        imageText += text + "\n"
      }
      return imageText.trim();
    } catch (error) {
      console.error('OCR error:', error);
    }
  }
  

 async function convertIntoImages(bufferData,pageCount,pdfPath){
   const promises = [];
   console.log(pdfPath);
   for (let i = 1; i <= pageCount; i++) {
     options.saveFilename = pdfPath;
     const convert = fromBuffer(bufferData, options);
     promises.push(convert(i, { responseType: "image" }))
   }
   try {
     await Promise.all(promises);
     return await getText(pdfPath, pageCount);
   } catch (error) {
     return console.error('Error:', error);
   }
 }

export default  convertIntoImages