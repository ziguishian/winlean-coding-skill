# WinLean Coding Skill

Windows-safe coding agents with leaner context, dependency scouting, and smaller verified patches.

> Clear first, then act. Read less. Patch smaller. Reuse more. Verify every change.

## Docs

- [English Docs](README.en.md)
- [Chinese Docs](README.zh-CN.md)

## What This Is

WinLean is a reusable Coding Skill for AI code agents working in real Windows repositories. It helps agents avoid brittle PowerShell commands, mixed encodings, CRLF/LF replacement failures, excessive context reads, unnecessary custom code, and overbuilt abstractions.

The main runtime file is [`SKILL.md`](SKILL.md). Codex-style agents can load it directly from the repository root.

## Install Into Codex

Clone this repository into your Codex skills directory.

Windows PowerShell:

```powershell
git clone https://github.com/ziguishian/winlean-coding-skill.git "$env:USERPROFILE\.codex\skills\winlean-coding"
```

macOS / Linux:

```bash
git clone https://github.com/ziguishian/winlean-coding-skill.git ~/.codex/skills/winlean-coding
```

Start a new Codex session and ask:

```text
Use winlean-coding full. Read only relevant files, check dependency options before custom code, make the smallest Windows-safe patch, and verify the diff.
```

## Use With Other Code Agents

If your agent does not support Codex skills directly:

1. Add this repository to a location your agent can read.
2. Point the agent at [`SKILL.md`](SKILL.md).
3. Copy [`examples/AGENTS.md`](examples/AGENTS.md) into your project root if your agent reads project-level instructions.
4. Use [`examples/safe-replace.mjs`](examples/safe-replace.mjs) for exact UTF-8 replacements when needed.

Auto-discovery depends on each agent's conventions, but the instructions are plain Markdown and can be used by any code agent that accepts project guidance.

## Modes

- `lite`: context gate, smallest patch, minimal verification.
- `full`: default; Windows Safe Mode, Dependency Scout, Safe Patch Agent, and Diff Reviewer.
- `audit`: review-only mode for plans or diffs.

## Requirements

- No package installation is required.
- `SKILL.md` is plain Markdown with YAML frontmatter.
- Helper scripts use only Node.js built-in modules.
- Node.js is only required if you run the helper scripts or validator.

## Validate

From the repository root:

```bash
node scripts/validate-skill.mjs .
```

Expected output:

```text
WinLean skill validation passed: .
```

## Files

| path | purpose |
|---|---|
| `SKILL.md` | Main skill instructions loaded by Codex |
| `agents/openai.yaml` | Codex UI metadata |
| `README.md` | GitHub and install entry page |
| `README.en.md` | Full English documentation |
| `README.zh-CN.md` | Full Chinese documentation |
| `examples/AGENTS.md` | Project-root instruction example |
| `examples/safe-replace.mjs` | Safe UTF-8 exact replacement helper |
| `checklists/windows-safe-checklist.md` | Windows safety checklist |
| `checklists/lean-code-checklist.md` | Lean coding checklist |
| `scripts/validate-skill.mjs` | Zero-dependency validator |

## Is This Enough To Use Directly?

Yes for Codex-style skill loading: the repository root contains `SKILL.md`, optional UI metadata, examples, checklists, and helper scripts. A user can clone the repository into their skills directory and use it without installing dependencies.

For non-Codex agents, direct auto-discovery depends on that agent's conventions. The content is still usable by pointing the agent at `SKILL.md` or by copying `examples/AGENTS.md` into the target project.