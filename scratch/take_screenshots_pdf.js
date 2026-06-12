const { chromium } = require('playwright');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const url = 'http://localhost:3000';
  const outputDir = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\74b1b4a8-7771-4287-a1fd-13ad7c09cfe5';
  
  // Clean up any old PDF files
  const pdfOutputPath = path.join(outputDir, 'ARTHAM_OS_Demo_Book.pdf');
  if (fs.existsSync(pdfOutputPath)) {
    fs.unlinkSync(pdfOutputPath);
    console.log('Removed old brain PDF.');
  }
  const workspacePdfPath = 'c:/Users/user/3D Objects/New folder/artham/ARTHAM_OS_Demo_Book.pdf';
  if (fs.existsSync(workspacePdfPath)) {
    fs.unlinkSync(workspacePdfPath);
    console.log('Removed old workspace PDF.');
  }

  console.log('Launching Playwright Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log(`Navigating to ${url}...`);
  await page.goto(url);
  await sleep(5000); // Wait for page logic load

  const tabs = [
    { name: 'INDEX', buttonText: 'INDEX', screenshotName: 'remote_index_tab.png' },
    { name: 'TWIN', buttonText: 'TWIN', screenshotName: 'remote_twin_tab.png', action: async () => {
      try {
        await page.click("button:has-text('SOVEREIGN PORTS TELEMETRY')", { timeout: 3000 });
        await sleep(1000);
      } catch (e) {
        console.log('TWIN action failed, capturing default:', e.message);
      }
    }},
    { name: 'PRIME', buttonText: 'INDEX', screenshotName: 'remote_prime_tab.png', action: async () => {
      try {
        await page.click("button:has-text('Red Sea crisis input costs')", { timeout: 3000 });
        await sleep(3000);
      } catch (e) {
        console.log('PRIME action failed:', e.message);
      }
    }},
    { name: 'FORECAST', buttonText: 'FORECAST', screenshotName: 'remote_forecast_tab.png' },
    { name: 'SCENARIO LAB', buttonText: 'SCENARIO LAB', screenshotName: 'remote_scenario_lab_tab.png', action: async () => {
      try {
        await page.click("button:has-text('Oil Shock ($150)')", { timeout: 3000 });
        await sleep(2500);
      } catch (e) {
        console.log('SCENARIO LAB action failed:', e.message);
      }
    }},
    { name: 'SITUATION ROOM', buttonText: 'SITUATION ROOM', screenshotName: 'remote_situation_room_tab.png', action: async () => {
      try {
        await page.click("button:has-text('Generate Brief')", { timeout: 3000 });
        await sleep(2000);
      } catch (e) {
        console.log('SITUATION ROOM brief generation action failed:', e.message);
      }
    }},
    { name: 'REPLAY', buttonText: 'REPLAY', screenshotName: 'remote_replay_tab.png' },
    { name: 'INTEL FEED', buttonText: 'INTEL FEED', screenshotName: 'remote_feed_tab.png' }
  ];

  const imagesPaths = [];

  for (const tab of tabs) {
    console.log(`Processing Tab: ${tab.name}...`);
    try {
      if (tab.name !== 'INDEX') {
        // Find navigation button in the left sidebar and click it
        await page.click(`aside button:has-text('${tab.buttonText}')`, { timeout: 5000 });
        await sleep(2000);
      }
      if (tab.action) {
        await tab.action();
      }
      const screenshotPath = path.join(outputDir, tab.screenshotName);
      await page.screenshot({ path: screenshotPath });
      imagesPaths.push(screenshotPath);
      console.log(`Successfully captured ${tab.screenshotName}`);
    } catch (e) {
      console.error(`Failed to capture tab ${tab.name}:`, e.message);
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully. Commencing PDF compilation...');

  try {
    const pdfDoc = await PDFDocument.create();
    const width = 612; // letter size width
    const height = 792; // letter size height
    const img_w = width - 20;
    const img_h = img_w / 1.6; // 1440x900 aspect ratio = 1.6

    // 1-8. Embed screenshots
    for (const imgPath of imagesPaths) {
      if (fs.existsSync(imgPath)) {
        console.log(`Embedding ${path.basename(imgPath)} into PDF...`);
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

    // 9. Programmatic closing hero slide
    console.log('Adding programmatic closing hero slide...');
    const pageNode = pdfDoc.addPage([width, height]);
    
    // Draw deep dark background (#03001C)
    pageNode.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: height,
      color: rgb(3 / 255, 0, 28 / 255)
    });

    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Title: ARTHAM OS
    pageNode.drawText('ARTHAM OS', {
      x: 50,
      y: height - 120,
      size: 40,
      font: helveticaBold,
      color: rgb(1, 1, 1)
    });

    // Tagline: A Sovereign Economic Intelligence Platform
    pageNode.drawText('A Sovereign Economic Intelligence Platform', {
      x: 50,
      y: height - 165,
      size: 16,
      font: helvetica,
      color: rgb(175 / 255, 169 / 255, 236 / 255) // #AFA9EC
    });

    // Horizontal divider line
    pageNode.drawRectangle({
      x: 50,
      y: height - 190,
      width: width - 100,
      height: 1.5,
      color: rgb(50 / 255, 50 / 255, 80 / 255)
    });

    // Four core pillars
    pageNode.drawText('Observe | Reason | Forecast | Recommend', {
      x: 50,
      y: height - 240,
      size: 14,
      font: helveticaBold,
      color: rgb(255 / 255, 255 / 255, 255 / 255)
    });

    // Value Proposition Statement
    pageNode.drawText('Financial Markets Have Bloomberg.', {
      x: 50,
      y: height - 310,
      size: 20,
      font: helveticaBold,
      color: rgb(255 / 255, 255 / 255, 255 / 255)
    });

    pageNode.drawText('The Physical Economy Has ARTHAM.', {
      x: 50,
      y: height - 345,
      size: 20,
      font: helveticaBold,
      color: rgb(175 / 255, 169 / 255, 236 / 255) // #AFA9EC
    });

    // Target Audience Description
    pageNode.drawText('Built to help governments,', {
      x: 50,
      y: height - 400,
      size: 11,
      font: helvetica,
      color: rgb(150 / 255, 150 / 255, 170 / 255)
    });

    pageNode.drawText('regulators,', {
      x: 50,
      y: height - 420,
      size: 11,
      font: helvetica,
      color: rgb(150 / 255, 150 / 255, 170 / 255)
    });

    pageNode.drawText('infrastructure operators,', {
      x: 50,
      y: height - 440,
      size: 11,
      font: helvetica,
      color: rgb(150 / 255, 150 / 255, 170 / 255)
    });

    pageNode.drawText('and economic decision-makers', {
      x: 50,
      y: height - 460,
      size: 11,
      font: helvetica,
      color: rgb(150 / 255, 150 / 255, 170 / 255)
    });

    pageNode.drawText('understand disruptions', {
      x: 50,
      y: height - 480,
      size: 11,
      font: helvetica,
      color: rgb(150 / 255, 150 / 255, 170 / 255)
    });

    pageNode.drawText('before economic damage spreads.', {
      x: 50,
      y: height - 500,
      size: 11,
      font: helvetica,
      color: rgb(150 / 255, 150 / 255, 170 / 255)
    });

    // Version String
    pageNode.drawText('Version 2026.1', {
      x: 50,
      y: 50,
      size: 10,
      font: helvetica,
      color: rgb(100 / 255, 100 / 255, 120 / 255)
    });

    // Save final document
    const pdfBytes = await pdfDoc.save();
    const pdfOutputPath = path.join(outputDir, 'ARTHAM_OS_Demo_Book.pdf');
    fs.writeFileSync(pdfOutputPath, pdfBytes);
    console.log(`Success: Unified PDF compiled successfully at ${pdfOutputPath}`);

    const workspacePdfPath = 'c:/Users/user/3D Objects/New folder/artham/ARTHAM_OS_Demo_Book.pdf';
    fs.writeFileSync(workspacePdfPath, pdfBytes);
    console.log(`Success: Unified PDF copied to workspace at ${workspacePdfPath}`);
  } catch (pdfError) {
    console.error('Failed to compile PDF:', pdfError.message);
  }
}

run().catch(console.error);
