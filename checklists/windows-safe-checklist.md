# Windows Safe Checklist

Use this checklist when coding on Windows or when a task touches Windows paths, encodings, non-ASCII text, Markdown, prompts, templates, or exact replacements.

## Environment

- [ ] Identify whether the environment is Windows, WSL, Linux, or macOS.
- [ ] Identify the shell: PowerShell, cmd, Git Bash, WSL shell, bash, zsh, or other.
- [ ] Check whether paths are Windows-style, POSIX-style, or mixed.
- [ ] Quote paths that may contain spaces or special characters.
- [ ] Avoid assuming case-sensitive filesystem behavior.

## Text Risk

- [ ] Check whether the task touches Chinese, emoji, Markdown, prompts, templates, localization files, YAML, JSON, or template strings.
- [ ] Treat unknown legacy files as encoding-sensitive.
- [ ] Treat exact replacements as newline-sensitive.
- [ ] Preserve the target file's encoding expectations and newline style.

## Command Safety

- [ ] Do not use PowerShell one-liners to write or replace Chinese, emoji, Markdown, prompts, or template text.
- [ ] Do not pipe non-ASCII replacement text through the terminal.
- [ ] Do not rely on PowerShell default encoding for text writes.
- [ ] Prefer the agent patch tool for small edits.
- [ ] Use Node.js or Python with explicit UTF-8 I/O for complex replacements.
- [ ] Prefer cross-platform path APIs such as Node.js `path` or Python `pathlib`.

## Patch Safety

- [ ] Patch only the smallest relevant region.
- [ ] Avoid whole-file rewrites unless required.
- [ ] Avoid formatting churn unrelated to the task.
- [ ] Avoid editing generated files unless explicitly required.
- [ ] Review `git diff` for accidental encoding or newline churn.

## Verification

- [ ] Run `git status --short`.
- [ ] Run `git diff --check`.
- [ ] Run the smallest relevant test, lint, typecheck, build, or script command.
- [ ] Report any verification that could not be run.
