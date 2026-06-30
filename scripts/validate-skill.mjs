#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const skillDir = process.argv[2] || path.resolve(import.meta.dirname, '..');

const requiredTextFiles = [
  'SKILL.md',
  'README.md',
  'README.en.md',
  'README.zh-CN.md',
  'LICENSE',
  '.gitattributes',
  'examples/AGENTS.md',
  'examples/safe-replace.mjs',
  'checklists/windows-safe-checklist.md',
  'checklists/lean-code-checklist.md',
  'agents/openai.yaml',
];

const requiredBinaryFiles = [
  'assets/winlean-logo.png',
  'assets/winlean-banner.png',
];

const requiredReadmeText = [
  'assets/winlean-logo.png',
  'assets/winlean-banner.png',
  'What WinLean Gives Your Project',
  'Skill + AGENTS.md',
  'Compared With Ponytail',
  'Internal n=1 Smoke Result',
  'Star History',
  'Install Into Codex',
];

const requiredSkillText = [
  'name: winlean-coding',
  '## Modes',
  '## 1. Environment Doctor',
  '## 2. Context Gatekeeper',
  '## 3. Dependency Scout',
  'Public Library Scout',
  '## 6. Diff Reviewer',
  'Dependency Decision',
];

const errors = [];

function fullPath(relativePath) {
  return path.join(skillDir, relativePath);
}

function checkExists(relativePath) {
  if (!existsSync(fullPath(relativePath))) {
    errors.push(`Missing required file: ${relativePath}`);
    return false;
  }
  return true;
}

function readUtf8(relativePath) {
  if (!checkExists(relativePath)) return '';

  const bytes = readFileSync(fullPath(relativePath));
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    errors.push(`Unexpected UTF-8 BOM: ${relativePath}`);
  }

  const text = bytes.toString('utf8');
  if (text.includes('\r')) {
    errors.push(`CRLF/CR newline found: ${relativePath}`);
  }

  return text;
}

for (const file of requiredTextFiles) {
  readUtf8(file);
}

for (const file of requiredBinaryFiles) {
  checkExists(file);
}

const skillText = readUtf8('SKILL.md');
const readmeText = readUtf8('README.md');

if (!skillText.startsWith('---\n')) {
  errors.push('SKILL.md must start with YAML frontmatter');
}

if (!skillText.includes('\n---\n\n# WinLean Coding Skill')) {
  errors.push('SKILL.md frontmatter must close before the title');
}

for (const needle of requiredSkillText) {
  if (!skillText.includes(needle)) {
    errors.push(`SKILL.md missing required text: ${needle}`);
  }
}

for (const needle of requiredReadmeText) {
  if (!readmeText.includes(needle)) {
    errors.push(`README.md missing required text: ${needle}`);
  }
}

const safeReplacePath = fullPath('examples/safe-replace.mjs');
if (existsSync(safeReplacePath)) {
  const check = spawnSync(process.execPath, ['--check', safeReplacePath], {
    encoding: 'utf8',
  });
  if (check.status !== 0) {
    errors.push(`safe-replace.mjs syntax check failed:\n${check.stderr || check.stdout}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`WinLean skill validation passed: ${skillDir}`);