const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const wakaCli = path.join(os.homedir(), '.wakatime', 'wakatime-cli-windows-amd64.exe');
const project1 = path.resolve('c:/Users/user/3D Objects/New folder/artham'); 
const plugin = "vscode/1.85.0 vscode-wakatime/24.0.0";

// A recursive function to get all actual code files in a project
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.existsSync(dirPath) ? fs.readdirSync(dirPath) : [];
  arrayOfFiles = arrayOfFiles || [];
  
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.md')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

const allFiles1 = getAllFiles(project1);
let currentFilesPool = [...allFiles1]; 

console.log(`[ADVANCED WAKATIMER] Engine Initiated in Artham.`);
console.log(`- Loaded ${allFiles1.length} files from Artham project`);
console.log(`Commencing realistic developer simulation. Evasion mode: ON.`);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sendHeartbeat(file, isWrite, lineno, cursorpos) {
  const args = [
    '--entity', file,
    '--plugin', plugin,
    '--category', 'coding',
    '--lineno', lineno.toString(),
    '--cursorpos', cursorpos.toString()
  ];
  if (isWrite) {
    args.push('--write');
  }

  const child = spawn(wakaCli, args);
  child.on('error', (err) => { /* ignore */ });
  child.on('close', (code) => {
    if (code === 0) process.stdout.write(isWrite ? 'W' : '.'); 
  });
}

function runSimulationLoop() {
  if (currentFilesPool.length === 0) currentFilesPool = [...allFiles1];
  const activeFile = currentFilesPool[getRandomInt(0, currentFilesPool.length - 1)];
  
  let lines = 100;
  try { lines = fs.readFileSync(activeFile, 'utf-8').split('\n').length; } catch(e) {}
  
  let currentLine = getRandomInt(1, Math.max(1, lines));
  let cursor = getRandomInt(0, 50);

  const actionsInBurst = getRandomInt(2, 8);
  let actionsCompleted = 0;

  function doAction() {
    if (actionsCompleted >= actionsInBurst) {
      let delayToNextBurst = getRandomInt(15000, 45000); 

      if (Math.random() > 0.90) {
        delayToNextBurst = getRandomInt(60000, 110000);
        console.log(`\n[SIM-ARTHAM] Taking a short break for ${Math.floor(delayToNextBurst/1000)}s...`);
      }

      setTimeout(runSimulationLoop, delayToNextBurst);
      return;
    }

    currentLine += getRandomInt(0, 2); 
    cursor += getRandomInt(-10, 20);
    if (cursor < 0) cursor = 0;

    const isWrite = Math.random() > 0.6; 
    sendHeartbeat(activeFile, isWrite, currentLine, cursor);

    actionsCompleted++;
    setTimeout(doAction, getRandomInt(1000, 5000));
  }

  doAction();
}

runSimulationLoop();
