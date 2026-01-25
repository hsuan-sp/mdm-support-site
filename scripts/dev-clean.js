#!/usr/bin/env node

/**
 * 🚀 MDM Docs Professional Debug Cleaner
 * 功能：清除快取、生成資料、殺掉 Port 佔用並在 4000 Port 啟動
 */

import { exec, spawn } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execPromise = promisify(exec);

const PORT = 4000; // 固定為 4000 Port
const isWindows = process.platform === "win32";
const CWD = process.cwd();

// --- 1. 清除暫存檔案邏輯 ---
async function cleanArtifacts() {
  console.log("\x1b[35m🧹 Cleaning artifacts and cache...\x1b[0m");
  
  const foldersToClean = [
    ".next",
    "out",
    "node_modules/.cache",
    "lib/generated-data.json" // 確保舊資料被移除
  ];

  for (const folder of foldersToClean) {
    const fullPath = path.join(CWD, folder);
    try {
      if (fs.existsSync(fullPath)) {
        // 使用 Node 20+ 的 rmSync
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`   \x1b[32m✓ Removed: ${folder}\x1b[0m`);
      }
    } catch (err) {
      console.log(`   \x1b[33m⚠️  Failed to remove ${folder}: ${err.message}\x1b[0m`);
    }
  }
}

// --- 2. 殺掉 Port 佔用邏輯 ---
async function killProcessOnPort(port) {
  console.log("\x1b[36m🔍 Checking for processes on port %d...\x1b[0m", port);
  try {
    let command = isWindows ? `netstat -ano | findstr :${port}` : `lsof -ti:${port}`;
    let stdout;
    
    try {
      const result = await execPromise(command);
      stdout = result.stdout;
    } catch (err) {
      console.log("\x1b[32m✓ Port %d is free\x1b[0m", port);
      return;
    }

    if (!stdout || !stdout.trim()) return;

    console.log("\x1b[33m⚠️  Found process(es) using port %d, cleaning up...\x1b[0m", port);

    const pids = new Set();
    if (isWindows) {
      stdout.split("\n").forEach((line) => {
        const match = line.trim().match(/LISTENING\s+(\d+)/);
        if (match) pids.add(match[1]);
      });
    } else {
      stdout.trim().split("\n").forEach((p) => pids.add(p.trim()));
    }

    for (const processId of pids) {
      console.log("   \x1b[31mKilling PID: %s\x1b[0m", processId);
      const killCmd = isWindows ? `taskkill /F /PID ${processId}` : `kill -9 ${processId}`;
      await execPromise(killCmd);
    }
    
    // 等待 OS 釋放 Socket
    await new Promise((resolve) => setTimeout(resolve, 800));
  } catch (error) {
    console.log("\x1b[33m⚠️  Skip Kill Port: %s\x1b[0m", error.message);
  }
}

// --- 3. 啟動開發伺服器 ---
async function startDevServer() {
  console.log("\n\x1b[32m✅ System Clean. Starting dev server on Port 4000...\x1b[0m\n");

  const npm = isWindows ? "npm.cmd" : "npm";
  // 注意：這裡跑的是 "npm run dev"，會觸發我們 package.json 裡的 gen-data
  const devProcess = spawn(npm, ["run", "dev"], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, PORT: "4000" } // 強制環境變數也是 4000
  });

  devProcess.on("error", (error) => {
    console.error("\x1b[31m❌ Failed to start:\x1b[0m", error);
    process.exit(1);
  });
}

// --- 執行流程 ---
(async () => {
  console.clear();
  console.log("\x1b[1m\x1b[34m=== MDM DOCS DEBUG MODE ===\x1b[0m\n");
  
  await cleanArtifacts();
  await killProcessOnPort(PORT);
  await startDevServer();
})();