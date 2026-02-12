#!/usr/bin/env node
/**
 * 跨平台入口：根据平台调用 shadow.sh 或 shadow.cmd
 */

const { spawnSync } = require('child_process');
const path = require('path');

const scriptDir = __dirname;
const isWin = process.platform === 'win32';
const script = isWin ? 'shadow.cmd' : 'shadow.sh';
const scriptPath = path.join(scriptDir, script);

const args = process.argv.slice(2);
const result = spawnSync(scriptPath, args, {
  stdio: 'inherit',
  shell: isWin,
  cwd: process.cwd(),
});

process.exit(result.status ?? 1);
