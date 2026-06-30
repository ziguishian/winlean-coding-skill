---
name: winlean-coding
description: Make Codex safer and leaner when coding, especially on Windows. Use for coding tasks where Windows shells, PowerShell, cmd, Git Bash, WSL, Unicode/Chinese/emoji/Markdown/prompt files, UTF-8/GBK/CP936 encoding, CRLF/LF line endings, path differences, shell one-liners, external library decisions, dependency reuse, bloated implementations, generated directories, small patches, or minimal verification matter.
---

# WinLean Coding Skill

Clear first, then act. Read less. Patch smaller. Reuse more. Verify every change.

Use this skill as a compact runtime loop. Load checklists only when the task needs deeper detail.

## Modes

- `lite`: context gate + smallest patch + minimal verification.
- `full`: default. Add Windows Safe Mode, Dependency Scout, and Diff Reviewer.
- `audit`: do not edit; review a plan or diff for Windows risk, token waste, and overbuilding.

If no mode is named, use `full`.

## 1. Environment Doctor

Identify OS and shell: Windows/WSL/Linux/macOS and PowerShell/cmd/Git Bash/WSL shell/bash/zsh.

Enter Windows Safe Mode when Windows paths or shells meet Chinese, emoji, Markdown, prompts, templates, localization, exact replacement, uncertain encoding, or CRLF/LF-sensitive files.

Windows Safe Mode:

- Do not write non-ASCII text through PowerShell one-liners or terminal pipes.
- Prefer patch edits for small changes.
- Use Node.js or Python with explicit UTF-8 I/O for complex replacement.
- Preserve meaning, encoding expectations, and newline style.
- Use cross-platform path APIs.

Full checklist: `checklists/windows-safe-checklist.md`.

## 2. Context Gatekeeper

Read only files that can change the implementation decision. Search first, then open the smallest relevant files or snippets.

Do not read by default: `node_modules/`, `.git/`, `dist/`, `build/`, `out/`, `.next/`, `.nuxt/`, `coverage/`, `.cache/`, `.turbo/`, `.vite/`, `vendor/`, `generated/`, lock files unless dependency resolution matters, binaries, images, or archives.

Prefer user-named files, `package.json` or workspace manifests, entry points, nearby source, related tests, and existing utilities/components/hooks/services. Stop once the path is clear.

## 3. Dependency Scout

Before custom code, choose the highest rung that works:

1. Framework official capability.
2. Officially recommended library.
3. Mature open-source library.
4. Existing project dependency.
5. Existing project utility/component/hook/service.
6. Small local implementation.
7. Large handwritten implementation only when nothing suitable fits.

### Internal Reuse Scout

Check existing dependencies, utilities, components, hooks, services, validators, formatters, test helpers, framework features, and standard library APIs. Reuse local conventions. Do not duplicate logic under a new name.

### Public Library Scout

For common solved domains, consider mature public libraries before handwritten code: date/time/timezones, validation, Markdown/HTML/AST, CSV/Excel/PDF, images, color, drag-and-drop, rich text, i18n, crypto/auth, schemas, diff/patch/text transforms, CLI parsing, logging, charts, state machines, search/fuzzy matching, uploads, URLs, animation, virtual lists, code highlighting, and test mocks.

Do not add a library for five lines of logic or a heavy dependency for novelty. Never install production dependencies automatically; explain and ask first. If network access is unavailable, say external library status cannot be verified.

When recommending a library, state why, what it solves, what it saves versus handwritten code, risks, dependency impact, install command, and a minimal example.

## 4. Minimal Planner

Before patching, state: problem, files to change, files not changing, reuse decision, smallest implementation path, and minimum verification.

Prefer one file over three, 20 lines over 200, local patches over rewrites, and present needs over future abstractions.

Bug fixes target root cause, not symptoms. Check sibling callers before patching a shared function; one correct shared guard is smaller than scattered guards.

## 5. Safe Patch Agent

Patch locally and preserve surrounding style. Avoid formatting churn, generated files, lock files without dependency changes, unrelated refactors, unused helpers/types/classes, unnecessary service layers, and framework wrappers without a real need.

Deletion beats addition when behavior remains correct. Boring beats clever. If an intentional shortcut has a known ceiling, add one concise comment naming the ceiling and upgrade path.

For exact UTF-8 replacements:

```bash
node examples/safe-replace.mjs <targetFile> <oldTextFile> <newTextFile>
```

## 6. Diff Reviewer

Before finishing, check: necessary files only, no accidental generated/dependency reads or edits, no unjustified whole-file rewrite, reuse considered, no unnecessary dependency, encoding/newline handled intentionally, Windows-unstable commands avoided, minimum verification run or reason stated.

Non-trivial logic should leave one small runnable check when practical. Trivial one-liners need no test scaffolding.

Validate this skill with:

```bash
node scripts/validate-skill.mjs
```

Final report:

```text
Changed
- ...

Dependency Decision
- External libraries checked: yes/no/unable to verify.
- External library used: yes/no.
- Reason: ...
- New dependency approval needed: yes/no.
- Why not handwritten: ...

Reused
- ...

Avoided
- ...

Verified
- ...

Risks
- ...
```

Anti-bloat checklist: `checklists/lean-code-checklist.md`.