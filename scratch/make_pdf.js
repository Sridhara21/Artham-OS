const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function run() {
  const outputDir = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\74b1b4a8-7771-4287-a1fd-13ad7c09cfe5';
  
  const images = [
    'remote_index_tab.png',
    'remote_twin_tab.png',
    'remote_prime_tab.png',
    'remote_scenario_lab_tab.png',
    'remote_forecast_tab.png',
    'remote_replay_tab.png',
    'remote_situation_room_tab.png',
    'remote_feed_tab.png'
  ];

  console.log('Commencing PDF compilation...');

  try {
    const pdfDoc = await PDFDocument.create();
    const width = 612; // letter size width
    const height = 792; // letter size height
    const img_w = width - 20;
    const img_h = img_w / 1.6; // 1440x900 aspect ratio = 1.6

    for (const imgName of images) {
      const imgPath = path.join(outputDir, imgName);
      if (fs.existsSync(imgPath)) {
        console.log(`Embedding ${imgName} into PDF...`);
        const imageBytes = fs.readFileSync(imgPath);
        const pngImage = await pdfDoc.embedPng(imageBytes);
        const pageNode = pdfDoc.addPage([width, height]);
        pageNode.drawImage(pngImage, {
          x: 10,
          y: (height - img_h) / 2,
          width: img_w,
          height: img_h
        });
      } else {
        console.warn(`Warning: Image not found at ${imgPath}`);
      }
    }

    const pdfBytes = await pdfDoc.save();
    const pdfOutputPath = path.join(outputDir, 'artham_os_screenshots.pdf');
    fs.writeFileSync(pdfOutputPath, pdfBytes);
    console.log(`Success: Unified PDF compiled successfully at ${pdfOutputPath}`);
  } catch (pdfError) {
    console.error('Failed to compile PDF:', pdfError.message);
  }
}

run().catch(console.error);
