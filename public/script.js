const pdfFile = document.getElementById('file-to-upload');
const pdfContainer = document.querySelector('.pdf-container');


function uploadFile(file) {
  const formData = new FormData();
  formData.append('pdfFile', file);
  console.log(formData)

  fetch('/upload', {
      method: 'POST',
      body: formData,
  })
  .then(response => response.json())
  .then(data => {
      console.log('File uploaded successfully:', data);
  })
  .catch(error => {
      console.error('Error uploading file:', error);
  });
}


pdfFile.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  console.log(file)
  uploadFile(file)
  if (!file) {
    return;
  }

  const pdfData = await file.arrayBuffer();

  pdfjsLib.getDocument({ data: pdfData }).promise.then(async (pdfDoc) => {
    const numPages = pdfDoc.numPages;

    for (let i = 1; i <= numPages; i++) {
      const pageDiv = document.createElement('div');
      pageDiv.classList.add('pdf-page');

      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: 1 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      pageDiv.appendChild(canvas);

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext);

      pdfContainer.appendChild(pageDiv);
    }
  });
});
