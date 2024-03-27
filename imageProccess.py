
from pdf2image import convert_from_bytes
from fastapi import FastAPI
import cv2
import numpy as np
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe' 

app = FastAPI()
import uvicorn
import  PyPDF2, io

def pdfPagesToImages(pdfPath):
    image_unique_name = pdfPath.split("\\")[-1]
    with open(pdfPath, "rb")as file:
        data = file.read()
        reserve_pdf_on_memory = io.BytesIO(data)
        load_pdf = PyPDF2.PdfReader(reserve_pdf_on_memory)
        images = convert_from_bytes(data,poppler_path=r"poppler-24.02.0\Library\bin")
        for i in range(len(load_pdf.pages)):
            images[i].save('pdfPagesImages\\'+image_unique_name+ str(i) +'.jpg', 'JPEG')
        imagePagesOCR(image_unique_name,load_pdf)
        

def imagePagesOCR(image_unique_name,load_pdf):
    with open("extractedText\\"+image_unique_name+".txt","a")as extratedTextFIle:
        for i in range(len(load_pdf.pages)):
            img = cv2.imread("pdfPagesImages\\" + image_unique_name+ str(i) + ".jpg")  # Read result3.png
            text = pytesseract.image_to_string(img, config="--psm 6")
            print("Text found: " + text)
            extratedTextFIle.write(text)
    



@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/pdf_name/{pdfPath}")
def read_item(pdfPath: str):
    print(pdfPath)
    pdfPagesToImages((pdfPath).replace("-","\\"))
    return {"pdf_name": pdfPath}


if __name__ == "__main__":
    uvicorn.run(app,port=3000)