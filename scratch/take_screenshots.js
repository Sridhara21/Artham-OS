const { chromium } = require('playwright');
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
  await sleep(4000); // Wait for page logic load

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
    { name: 'PRIME', buttonText: 'PRIME', screenshotName: 'remote_prime_tab.png', action: async () => {
      try {
        await page.click("button:has-text('Red Sea crisis input costs')", { timeout: 3000 });
        await sleep(3000);
      } catch (e) {
        console.log('PRIME action failed:', e.message);
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
    { name: 'FORECAST', buttonText: 'FORECAST', screenshotName: 'remote_forecast_tab.png' },
    { name: 'REPLAY', buttonText: 'HISTORICAL INTEL', screenshotName: 'remote_replay_tab.png' },
    { name: 'SITUATION ROOM', buttonText: 'SITUATION ROOM', screenshotName: 'remote_situation_room_tab.png', action: async () => {
      try {
        await page.click("button:has-text('Generate Brief')", { timeout: 3000 });
        await sleep(2000);
      } catch (e) {
        console.log('SITUATION ROOM brief generation action failed:', e.message);
      }
    }},
    { name: 'INTELLIGENCE FEED', buttonText: 'ALERT FEED', screenshotName: 'remote_feed_tab.png' }
  ];

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
      console.log(`Successfully captured ${tab.screenshotName}`);
    } catch (e) {
      console.error(`Failed to capture tab ${tab.name}:`, e.message);
    }
  }

  await browser.close();
  console.log('Screenshots captured successfully.');
}

run().catch(console.error);
