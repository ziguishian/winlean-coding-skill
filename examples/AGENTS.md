# AGENTS.md

## Default Skill

Use the `winlean-coding` skill for coding tasks unless the user explicitly asks for a different workflow.

Core principles:

- Clear first, then act.
- Read less. Patch smaller. Reuse more. Verify every change.


## Modes

Use the smallest mode that fits the task:

- `lite`: small, low-risk edits; read the least context, patch locally, and run minimum verification.
- `full`: default for normal coding; use Windows Safe Mode, Dependency Scout, Safe Patch Agent, and Diff Reviewer.
- `audit`: review-only mode for plans or diffs; do not edit files.

If the user does not name a mode, use ull.

## Context Rules

Do not read these by default:

- `node_modules/`
- `.git/`
- `dist/`
- `build/`
- `out/`
- `.next/`
- `.nuxt/`
- `coverage/`
- `.cache/`
- `.turbo/`
- `.vite/`
- `vendor/`
- `generated/`
- lock files, unless dependency resolution is relevant
- binary files
- images
- compressed files

Read files only when they are relevant to the task. Prefer user-named files, `package.json`, entry points, nearby source files, related tests, and existing utilities.

## Dependency Decisions

Use Dependency Scout for every non-trivial implementation: Internal Reuse Scout first, then Public Library Scout for common solved problems.

Before writing custom code, check in this order:

1. Framework official capability.
2. Officially recommended library.
3. Mature open-source library.
4. Existing project dependency.
5. Existing project utility, component, hook, or service.
6. Small local implementation.
7. Large handwritten implementation, only when no suitable library or existing code fits.

For common solved areas such as date/time, validation, Markdown/HTML/AST parsing, CSV/Excel/PDF, images, color, drag-and-drop, rich text, i18n, crypto/auth, schema validation, diff/patch, CLI parsing, logging, charts, state machines, search, uploads, URLs, animation, virtual lists, code highlighting, and test mocks, consider mature public libraries before handwritten code.

Do not automatically install production dependencies. Explain the reason and ask the user first.

If network access is unavailable, say external library status cannot be verified. Do not invent library facts.

## Windows Safety

On Windows, do not use PowerShell one-liners to write or replace Chinese, emoji, Markdown, prompt files, template strings, or localization content.

For non-ASCII or text-sensitive edits:

- Use the agent patch tool for small source edits.
- Use Node.js or Python with explicit UTF-8 read/write for complex replacements.
- Do not pipe non-ASCII replacement text through the terminal.
- Preserve encoding expectations and newline style.
- Quote paths and prefer cross-platform path APIs.

## Lean Coding

Before writing new code, check:

- Existing dependencies.
- Existing utilities.
- Existing hooks, services, and components.
- Existing tests and helpers.
- Framework-native features.
- Mature public libraries for common solved problems.

Prefer reuse. Do not add dependencies unless the benefit is clear. Ask the user before adding a production dependency.

Avoid:

- Unused helpers.
- Unused types.
- Unnecessary classes.
- New service layers for small changes.
- Duplicate implementations of existing logic.
- Broad refactors unrelated to the task.

## Patch Rules

Make small, local patches.

- If 1 file is enough, do not edit 3 files.
- If 20 lines are enough, do not write 200 lines.
- Do not rewrite whole files unless necessary.
- Do not edit generated files unless explicitly required.
- Do not modify lock files unless dependency changes require it.

## Review And Verification

After changes:

- Check `git status --short`.
- Review `git diff`.
- Run `git diff --check`.
- Run the smallest relevant test, typecheck, lint, build, or script command.
- Report any verification that could not be run.

Use this final report shape:

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
