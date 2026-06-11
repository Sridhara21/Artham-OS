const { chromium } = require('playwright');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const url = 'http://localhost:3000';
  const outputDir = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\74b1b4a8-7771-4287-a1fd-13ad7c09cfe5';
  
  console.log('Launching Playwright Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log(`Navigating to ${url}...`);
  await page.goto(url);
  await sleep(4000); // Wait for initial chart animation

  const tabs = [
    { name: 'INDEX', buttonText: 'INDEX', screenshotName: 'remote_index_tab.png' },
    { name: 'TWIN', buttonText: 'TWIN', screenshotName: 'remote_twin_tab.png', action: async () => {
      try {
        await page.click("button:has-text('SOVEREIGN PORTS TELEMETRY')", { timeout: 3000 });
        await sleep(1000);
        await page.click("circle[cx='42']", { timeout: 3000, force: true });
        await sleep(1000);
      } catch (e) {
        console.log('TWIN action failed, capturing default:', e.message);
      }
    }},
    { name: 'PRIME', buttonText: 'PRIME', screenshotName: 'remote_prime_tab.png', action: async () => {
      try {
        await page.click("button:has-text('Red Sea crisis input costs')", { timeout: 3000 });
        await sleep(3000);
      } catch (e) {
        console.log('PRIME action failed, trying alternative button text...');
        try {
          await page.click("button:has-text('How will a Red Sea disruption affect fertilizer costs in India?')", { timeout: 3000 });
          await sleep(3000);
        } catch (e2) {
          console.log('PRIME alternative action failed:', e2.message);
        }
      }
    }},
    { name: 'SCENARIO LAB', buttonText: 'SCENARIO LAB', screenshotName: 'remote_scenario_lab_tab.png', action: async () => {
      try {
        await page.click("button:has-text('Oil Shock ($150)')", { timeout: 3000 });
        await sleep(2500);
      } catch (e) {
        console.log('SCENARIO LAB action failed:', e.message);
      }
    }},
    { name: 'AUTOPILOT', buttonText: 'AUTOPILOT', screenshotName: 'remote_autopilot_tab.png', action: async () => {
      try {
        await page.click("span:has-text('Western DFC Corridor Congestion Override')", { timeout: 3000 });
        await sleep(1500);
      } catch (e) {
        console.log('AUTOPILOT action failed:', e.message);
      }
    }},
    { name: 'CHRONOS', buttonText: 'CHRONOS', screenshotName: 'remote_chronos_tab.png', action: async () => {
      try {
        await page.click("button:has-text('Suez Canal Blockage')", { timeout: 3000 });
        await sleep(1500);
      } catch (e) {
        console.log('CHRONOS action failed:', e.message);
      }
    }},
    { name: 'EARTH', buttonText: 'EARTH', screenshotName: 'remote_earth_tab.png' },
    { name: 'MONETIZE', buttonText: 'MONETIZE', screenshotName: 'remote_monetize_tab.png' }
  ];

  const imagesPaths = [];

  for (const tab of tabs) {
    console.log(`Processing Tab: ${tab.name}...`);
    try {
      if (tab.name !== 'INDEX') {
        await page.click(`button:has-text('${tab.buttonText}')`, { timeout: 5000 });
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

    const pdfBytes = await pdfDoc.save();
    const pdfOutputPath = path.join(outputDir, 'artham_os_screenshots.pdf');
    fs.writeFileSync(pdfOutputPath, pdfBytes);
    console.log(`Success: Unified PDF compiled successfully at ${pdfOutputPath}`);
  } catch (pdfError) {
    console.error('Failed to compile PDF:', pdfError.message);
  }
}

run().catch(console.error);
