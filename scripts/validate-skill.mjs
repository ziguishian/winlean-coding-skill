#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const skillDir = process.argv[2] || path.resolve(import.meta.dirname, '..');
const requiredFiles = [
  'SKILL.md',
  'README.en.md',
  'README.zh-CN.md',
  'examples/AGENTS.md',
  'examples/safe-replace.mjs',
  'checklists/windows-safe-checklist.md',
  'checklists/lean-code-checklist.md',
  'agents/openai.yaml',
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

function readUtf8(relativePath) {
  const fullPath = path.join(skillDir, relativePath);
  if (!existsSync(fullPath)) {
    errors.push(`Missing required file: ${relativePath}`);
    return '';
  }

  const bytes = readFileSync(fullPath);
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    errors.push(`Unexpected UTF-8 BOM: ${relativePath}`);
  }

  const text = bytes.toString('utf8');
  if (text.includes('\r')) {
    errors.push(`CRLF/CR newline found: ${relativePath}`);
  }

  return text;
}

for (const file of requiredFiles) {
  readUtf8(file);
}

const skillText = readUtf8('SKILL.md');

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

const safeReplacePath = path.join(skillDir, 'examples/safe-replace.mjs');
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
