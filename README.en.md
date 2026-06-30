# WinLean Coding Skill

WinLean Coding Skill is a reusable coding skill for AI agents. It makes Windows coding safer and keeps generated code smaller, more local, and easier to review.

Core ideas:

- Clear first, then act.
- Read less. Patch smaller. Reuse more. Verify every change.

## 1. What This Skill Solves

This skill addresses two recurring problems.

Windows reliability:

- PowerShell and Unix-like command behavior differ.
- Chinese, emoji, Markdown, prompts, templates, and localization files can be corrupted by shell encoding behavior.
- UTF-8, UTF-8 with BOM, GBK, CP936, and legacy encodings can be mixed.
- CRLF/LF differences can break exact replacements.
- Windows paths, escaping, globbing, and pipes differ from Linux/macOS behavior.
- Complex shell one-liners can create uncontrolled edits.

AI code bloat:

- Agents often read irrelevant directories such as `node_modules`, `dist`, `build`, `.next`, and `coverage`.
- Large files, generated artifacts, and binaries waste context.
- Agents may skip framework features, existing dependencies, utilities, components, hooks, and services.
- Agents may hand-write common solved problems instead of checking mature public libraries.
- Simple tasks can become unnecessary abstractions, types, helpers, adapters, or service layers.

## 2. When To Use It

Use this skill when:

- Coding on Windows, WSL, Git Bash, PowerShell, or cmd.
- Editing Chinese, emoji, Markdown, prompt files, template strings, localization files, YAML, or JSON.
- Performing exact text replacements where encoding or newline style matters.
- You want to reduce context reads and avoid token waste.
- You want the agent to check framework features, public libraries, existing dependencies, project utilities, and components before custom code.
- You want smaller, reviewable patches with minimum useful verification.

## 3. When Not To Use It

Do not treat this skill as:

- A full architecture rewrite guide.
- A repository-wide migration framework.
- A replacement for project-specific engineering standards.
- An automatic dependency installer.
- A build artifact or code generation manager.

For large migrations, dependency upgrades, or architecture changes, use this skill's safety rules, but still create a project-specific plan.

## 4. Modes

WinLean supports three operating modes:

| mode | use when | behavior |
|---|---|---|
| `lite` | small, low-risk edits | context gate, smallest patch, minimal verification |
| `full` | normal coding work | Windows Safe Mode, Dependency Scout, Safe Patch Agent, Diff Reviewer |
| `audit` | reviewing a plan or diff | no edits; reports Windows risk, token waste, dependency decisions, and overbuilding |

If no mode is named, use `full`.

## 5. Agent Workflow

`SKILL.md` defines six stages.

### Environment Doctor

Identify the OS and shell: Windows, WSL, Linux, macOS; PowerShell, cmd, Git Bash, WSL shell, and similar environments.

Detect whether the task touches Chinese, emoji, Markdown, prompt files, template strings, localization, exact replacement, or uncertain encodings. If it is Windows plus non-ASCII or text-sensitive content, enter Windows Safe Mode.

### Context Gatekeeper

Control what gets read. Do not read dependency directories, generated directories, caches, binaries, images, compressed files, or lock files unless the task requires them.

Read files only when there is a concrete reason. Prefer user-named files, `package.json`, entry points, related source files, nearby tests, and existing helpers instead of broad repository scans.

### Dependency Scout

Dependency Scout decides what should be reused before any custom implementation.

Decision priority:

1. Framework official capability.
2. Officially recommended library.
3. Mature open-source library.
4. Existing project dependency.
5. Existing project utility, component, hook, or service.
6. Small local implementation.
7. Large handwritten implementation only when no suitable option exists.

#### Internal Reuse Scout

Check project-local reuse:

- `package.json` and workspace manifests.
- Existing dependencies already installed in the project.
- Existing utilities, components, hooks, services, validators, formatters, test helpers, and adapters.
- Framework-native features already used by the codebase.
- Neighboring code patterns and conventions.

If the project already has the right tool, reuse it before writing new code.

#### Public Library Scout

Public Library Scout asks whether the broader ecosystem already solved the problem.

Before custom code, the agent must decide:

1. Is this a common problem?
2. Is there a mature open-source library for it?
3. Is there an official library, industry-standard library, or framework-recommended solution?
4. Would using a library be safer, shorter, or easier to maintain than handwritten code?
5. Is the dependency cost worth it?

For these domains, prefer mature libraries or official capabilities before handwritten code: dates, timezones, validation, Markdown, HTML, ASTs, CSV, Excel, PDF, image processing, color conversion, drag-and-drop, rich text, i18n, crypto, hashing, auth, schemas, diff/patch/text transforms, CLI argument parsing, logging, charts, state machines, search, fuzzy matching, uploads, resumable uploads, URLs, query strings, animation, virtual lists, syntax highlighting, and test mocks.

Rules:

- Do not add a library for five lines of simple logic.
- Do not add a heavy dependency for novelty.
- Do not automatically install production dependencies. Explain the reason and ask the user first.
- If network access is unavailable, say external library status cannot be verified. Do not invent popularity, maintenance, versions, or official recommendations.
- If recommending a library, report why it is recommended, what problem it solves, what it saves compared with handwritten code, risks, whether it adds a dependency, the install command, and a minimal example.

### Minimal Planner

Before patching, state:

- What problem is being solved.
- Which files need to change.
- Which files will not change.
- Whether existing framework capability, public libraries, dependencies, components, or utilities can be reused.
- The smallest implementation path.
- The minimum verification command.

Principles:

- If 1 file is enough, do not edit 3 files.
- If 20 lines are enough, do not write 200 lines.
- Prefer local patches over whole-file rewrites.
- Do not create abstractions for possible future needs.
- Fix the root cause instead of only the named symptom.

### Safe Patch Agent

Make safe, local changes.

On Windows:

- Do not use PowerShell one-liners to replace Chinese, emoji, Markdown, prompt text, templates, or localization content.
- Do not pipe non-ASCII replacement text through the terminal.
- Use the patch tool for small edits.
- Use Node.js or Python with explicit UTF-8 I/O for complex replacements.
- Preserve semantic meaning, encoding expectations, and newline style.
- Prefer cross-platform path APIs such as Node.js `path` or Python `pathlib`.

In code:

- Do not add unused helpers.
- Do not add unused types.
- Do not add unnecessary classes.
- Do not repeat logic already present in the project.
- Do not rewrite large regions when a local patch works.
- Prefer deletion when behavior remains correct.

### Diff Reviewer

After changes, check:

- Only necessary files changed.
- No accidental reads or edits in generated/dependency directories.
- No unjustified whole-file rewrite.
- Dependency Scout was applied.
- No unnecessary dependency was added.
- Encoding and newline handling were intentional.
- No Windows-unstable command was introduced.
- The smallest relevant verification ran, or the reason it could not run is stated.

## 6. Windows Safe Mode

Windows Safe Mode is activated when Windows paths or shells meet non-ASCII or text-sensitive files.

Use it for:

- Chinese text.
- Emoji.
- Markdown.
- Prompt files.
- Template strings.
- Localization files.
- YAML or JSON with non-ASCII content.
- Exact replacements.
- Unknown legacy encodings.

The main rule is simple: do not push fragile text through the shell. Use patch edits or explicit UTF-8 file I/O.

For exact replacements, use:

```bash
node examples/safe-replace.mjs <targetFile> <oldTextFile> <newTextFile>
```

The script reads and writes UTF-8, preserves LF/CRLF style, and refuses to modify the target when the old text is not found.

## 7. Token Saving

WinLean saves tokens by reducing input, output, and repair loops.

Input savings:

- Do not read `node_modules`, `.git`, `dist`, `build`, `out`, `.next`, `.nuxt`, `coverage`, `.cache`, `.turbo`, `.vite`, `vendor`, `generated`, binaries, images, archives, or lock files by default.
- Search first, then open the smallest relevant source files or snippets.
- Stop reading once the implementation path is clear.

Output savings:

- Reuse framework features, public libraries, project dependencies, and local helpers before custom code.
- Do not write helper/type/service layers for simple needs.
- Patch locally instead of rewriting whole files.
- Prefer one small runnable check over new test scaffolding for trivial edits.

Repair-loop savings:

- Avoid Windows encoding failures.
- Avoid newline mismatch failures.
- Avoid brittle shell one-liners.

## 8. Lean Code Rules

- Ask whether code needs to exist at all.
- Prefer framework-native capability.
- Prefer mature libraries for solved domains when dependency cost is justified.
- Prefer existing project code over new helpers.
- Prefer deletion over addition when behavior stays correct.
- Add no unused helpers, types, classes, wrappers, or service layers.
- Do not duplicate existing logic.
- Do not do unrelated refactors.
- Keep comments rare and useful.

## 9. How To Use It In A Project

Reference the skill explicitly in your task:

```text
Use winlean-coding full. Make the smallest Windows-safe patch. Check dependency options before custom code. Verify the diff.
```

For a small low-risk edit:

```text
Use winlean-coding lite. Read only the directly relevant files and run the smallest verification.
```

For review-only work:

```text
Use winlean-coding audit. Review this diff for Windows risk, token waste, dependency choices, and overbuilding.
```

## 10. How To Use It With AGENTS.md

Copy `examples/AGENTS.md` to the target repository root. It tells agents to:

- Use `winlean-coding` by default.
- Avoid dependency and generated directories.
- Avoid PowerShell one-liners for non-ASCII edits on Windows.
- Reuse framework capabilities, public libraries, dependencies, and project utilities before custom code.
- Make small patches.
- Review `git diff`.
- Run minimum useful verification.

## 11. Example Scenarios

Windows Markdown edit:

```text
Use winlean-coding full. Update this Chinese Markdown prompt. Do not use PowerShell one-liners. Preserve UTF-8 and LF.
```

Frontend date formatting:

```text
Use winlean-coding full. Before writing date logic, check framework capability, existing dependencies, and mature date/time libraries. Ask before adding a production dependency.
```

Bug fix:

```text
Use winlean-coding full. Find the root cause, patch the smallest shared location, and run the nearest test.
```

Diff audit:

```text
Use winlean-coding audit. Check this patch for generated-file edits, unnecessary dependencies, whole-file rewrites, and missing verification.
```

## 12. Recommended Output Format

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

## 13. Validation And Benchmark

Validate the skill itself:

```bash
node scripts/validate-skill.mjs
```

The repository also includes a project-build smoke benchmark. In the Codex run on 2026-06-30, WinLean used fewer processed, uncached, output, and reasoning tokens than Ponytail for the same task. See `benchmarks/project-build-smoke/results-codex-2026-06-30.md` in the repository root.