#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const [, , targetFile, oldTextFile, newTextFile] = process.argv;

if (!targetFile || !oldTextFile || !newTextFile) {
  console.error('Usage: node examples/safe-replace.mjs <targetFile> <oldTextFile> <newTextFile>');
  process.exit(2);
}

const readUtf8 = (file) => readFile(file, 'utf8');

const [targetText, oldText, newText] = await Promise.all([
  readUtf8(targetFile),
  readUtf8(oldTextFile),
  readUtf8(newTextFile),
]);

if (oldText.length === 0) {
  console.error('Old text file is empty. Refusing to modify the target file.');
  process.exit(2);
}

const firstIndex = targetText.indexOf(oldText);

if (firstIndex === -1) {
  console.error(`Old text was not found in ${targetFile}. No changes were made.`);
  process.exit(1);
}

if (targetText.indexOf(oldText, firstIndex + oldText.length) !== -1) {
  console.error('Old text appears more than once. Make the old text more specific.');
  process.exit(1);
}

const nextText =
  targetText.slice(0, firstIndex) +
  newText +
  targetText.slice(firstIndex + oldText.length);

await writeFile(targetFile, nextText, 'utf8');

console.log(`Updated ${path.resolve(targetFile)}`);
