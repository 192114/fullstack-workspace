#!/usr/bin/env node
/**
 * 更新 Cursor/VS Code workspace 文件，将新项目添加到 folders 数组
 * 用法: node update-workspace.js <project_path>
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_FILE = 'fullstack-workspace.code-workspace';

function getWorkspacePath() {
  // bin 目录的父目录即为 workspace 根
  const workspaceRoot = path.dirname(__dirname);
  return path.join(workspaceRoot, WORKSPACE_FILE);
}

function addProjectToWorkspace(projectPath) {
  const workspacePath = getWorkspacePath();
  let data = { folders: [], settings: {} };

  if (fs.existsSync(workspacePath)) {
    try {
      const content = fs.readFileSync(workspacePath, 'utf8');
      data = JSON.parse(content);
      if (!data.folders) data.folders = [];
      if (!data.settings) data.settings = {};
    } catch (e) {
      console.error('无法解析 workspace 文件，将创建新文件:', e.message);
    }
  }

  const normalizedPath = projectPath.replace(/\\/g, '/');
  const exists = data.folders.some(
    (f) => (f.path || f).replace(/\\/g, '/') === normalizedPath
  );
  if (!exists) {
    data.folders.push({ path: normalizedPath });
    fs.writeFileSync(workspacePath, JSON.stringify(data, null, 2), 'utf8');
  }
}

const projectPath = process.argv[2];
if (!projectPath) {
  console.error('用法: node update-workspace.js <project_path>');
  process.exit(1);
}

addProjectToWorkspace(projectPath);
