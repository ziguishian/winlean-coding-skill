<p align="center">
  <img src="assets/winlean-logo.png" width="128" alt="WinLean Coding Skill logo">
</p>

<h1 align="center">WinLean Coding Skill</h1>

<p align="center">
  <strong>Turn your AI coding agent into a Windows-aware, token-lean programmer.</strong>
</p>

<p align="center">
  <a href="README.en.md">English Docs</a> |
  <a href="README.zh-CN.md">Chinese Docs</a> |
  <a href="SKILL.md">SKILL.md</a> |
  <a href="examples/AGENTS.md">AGENTS.md</a>
</p>

<p align="center">
  <a href="https://github.com/ziguishian/winlean-coding-skill/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/ziguishian/winlean-coding-skill?style=for-the-badge&logo=github"></a>
  <a href="https://github.com/ziguishian/winlean-coding-skill/blob/main/LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-2ea44f?style=for-the-badge"></a>
  <img alt="zero dependencies" src="https://img.shields.io/badge/dependencies-zero-0ea5e9?style=for-the-badge">
  <img alt="Windows safe" src="https://img.shields.io/badge/windows-safe-2563eb?style=for-the-badge&logo=windows">
</p>

<p align="center">
  <img src="assets/winlean-banner.png" alt="WinLean Coding Skill banner">
</p>

---

WinLean is not another Windows setup guide. It is a reusable Coding Skill that changes how an AI agent behaves inside Windows-heavy repositories.

> Clear first, then act. Read less. Patch smaller. Reuse more. Verify every change.

## The Idea

The inspiration is simple: Windows agents often fail commands, corrupt text, read too much context, and hand-write code that should have been reused. Instead of explaining those rules in every prompt, put the operating discipline into a skill.

WinLean makes the agent do four things before it writes code:

1. Clear the environment: OS, shell, paths, encoding, newline risk.
2. Control context: avoid dependency/generated folders and open only files that matter.
3. Reuse first: framework features, public libraries, existing dependencies, project utilities.
4. Patch small: local changes, UTF-8-safe edits, minimal verification, diff review.

## What WinLean Gives Your Project

| Project pain | What WinLean makes the agent do | Practical benefit |
|---|---|---|
| PowerShell one-liners break or behave differently from Unix shells | Detect Windows shells and enter Windows Safe Mode for risky text edits | Fewer failed commands and fewer uncontrolled file edits |
| Chinese, emoji, Markdown, prompts, or i18n files get corrupted | Avoid piping non-ASCII text through PowerShell; use patch edits or explicit UTF-8 I/O | Less mojibake, safer prompt/docs/localization changes |
| Exact replacements fail because of CRLF/LF | Treat replacements as newline-sensitive and preserve file style | Fewer broken patches and retry loops |
| Agents read `node_modules`, `dist`, `.next`, coverage, caches, or binaries | Gate context before reading; prefer manifests, entry points, related source, nearby tests | Lower input tokens and less distraction |
| Agents write large native implementations for solved problems | Run Dependency Scout before custom code, including Public Library Scout for common domains | Shorter, safer, more maintainable solutions |
| Small tasks become helper/type/service sprawl | Prefer one-file local patches and no future-facing abstractions | Cleaner diffs and easier reviews |
| The final answer hides what was reused or avoided | Require a final report with Changed, Dependency Decision, Reused, Avoided, Verified, Risks | Better reviewability and accountability |

## Skill + AGENTS.md

WinLean is designed as two layers:

| Layer | Role |
|---|---|
| `SKILL.md` | Runtime method: how the agent should reason, edit, reuse, and verify |
| `examples/AGENTS.md` | Project memory: copy it into a repository root so the agent remembers WinLean rules every time |

Use the skill when you want the agent to follow the full workflow for a task. Use `AGENTS.md` when you want a project to keep the same guardrails across future sessions.

## Direct Use

Yes, this repository is enough to use directly.

- Codex-style skill loaders can use the repository root because `SKILL.md` is at the top level.
- `agents/openai.yaml` provides Codex UI metadata.
- `examples/AGENTS.md` can be copied into a project root for instruction-only agents.
- `examples/safe-replace.mjs` and `scripts/validate-skill.mjs` use only Node.js built-ins.
- No npm install is required.

## Install Into Codex

Windows PowerShell:

```powershell
git clone https://github.com/ziguishian/winlean-coding-skill.git "$env:USERPROFILE\.codex\skills\winlean-coding"
```

macOS / Linux:

```bash
git clone https://github.com/ziguishian/winlean-coding-skill.git ~/.codex/skills/winlean-coding
```

Then start a new Codex session:

```text
Use winlean-coding full. Read only relevant files, check dependency options before custom code, make the smallest Windows-safe patch, and verify the diff.
```

For a project-wide default, copy the example policy:

```text
Copy examples/AGENTS.md into your project root as AGENTS.md.
```

## Modes

| mode | use when | behavior |
|---|---|---|
| `lite` | small, low-risk edits | context gate, smallest patch, minimal verification |
| `full` | normal coding work | Windows Safe Mode, Dependency Scout, Safe Patch Agent, Diff Reviewer |
| `audit` | reviewing a plan or diff | no edits; reports Windows risk, token waste, dependency decisions, and overbuilding |

## Compared With Ponytail

[Ponytail](https://github.com/DietrichGebert/ponytail) is a strong lean-coding project with broad agent/plugin coverage and a larger public benchmark. WinLean is narrower by design: it focuses on Windows-safe coding, context discipline, dependency decisions, and UTF-8/LF-safe patching for Codex-style coding agents.

### Internal n=1 Smoke Result

This is a local Codex CLI smoke run, not a Ponytail official benchmark and not a universal claim. The Ponytail arm used a compact Ponytail-style prompt, not Ponytail's full public evaluation harness. The result is useful as a signal, not proof.

Same Codex CLI project-build smoke task, same model, same prompt shape, measured on 2026-06-30. Lower is better for token metrics.

| metric | Ponytail-style prompt | WinLean prompt | result |
|---|---:|---:|---|
| processed input+output | 123,027 | 116,387 | WinLean used 5.4% fewer |
| uncached+output | 18,067 | 16,419 | WinLean used 9.1% fewer |
| output tokens | 6,802 | 6,067 | WinLean used 10.8% fewer |
| reasoning tokens | 3,496 | 2,251 | WinLean used 35.6% fewer |
| generated LOC | 305 | 344 | Ponytail-style generated fewer LOC |

The honest takeaway: Ponytail is excellent at general code minimalism. WinLean's advantage is a more specific operating model for Windows repositories: avoid fragile commands, avoid bad text edits, read less irrelevant context, make dependency decisions explicit, then patch and verify narrowly.

### Practical Difference

| dimension | Ponytail | WinLean |
|---|---|---|
| Primary goal | Universal minimalism: write only what is needed | Windows-safe minimalism: read less, reuse more, patch smaller, verify |
| Token strategy | Avoid unnecessary code by climbing a minimalism ladder | Block waste before generation: context gate + dependency scout + small patches |
| Windows safety | General agent rules | Explicit PowerShell, UTF-8/GBK/CP936, CRLF/LF, path, and non-ASCII safeguards |
| Dependency decisions | Prefer existing/native/simple options | Adds Public Library Scout and reports dependency decisions explicitly |
| Portability | Broad plugin ecosystem across many agents | Codex-first standalone skill, plus AGENTS.md fallback for other agents |
| Best fit | General overbuilding prevention | Windows repos, multilingual text, prompt/Markdown/i18n edits, precise replacements |

WinLean borrows the best idea from Ponytail: code should justify its existence. It adds the Windows and context-safety layer needed when the problem is not just too much code, but fragile agent execution.

## Star History

<a href="https://www.star-history.com/#ziguishian/winlean-coding-skill&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=ziguishian/winlean-coding-skill&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=ziguishian/winlean-coding-skill&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=ziguishian/winlean-coding-skill&type=Date" />
  </picture>
</a>

## Use With Other Code Agents

If your agent does not support Codex skills directly:

1. Put this repository somewhere the agent can read.
2. Point the agent at `SKILL.md`.
3. Copy `examples/AGENTS.md` into the target project root if your agent reads project-level instructions.
4. Use `examples/safe-replace.mjs` for exact UTF-8 replacements when needed.

Auto-discovery depends on each agent's conventions, but the content is plain Markdown and can be used by any code agent that accepts project guidance.

## Validate

```bash
node scripts/validate-skill.mjs .
```

Expected output:

```text
WinLean skill validation passed: .
```

## Repository Map

| path | purpose |
|---|---|
| `SKILL.md` | Main skill instructions loaded by Codex |
| `agents/openai.yaml` | Codex UI metadata |
| `assets/winlean-logo.png` | Generated logo used by this README |
| `assets/winlean-banner.png` | Generated banner used by this README |
| `README.en.md` | Full English documentation |
| `README.zh-CN.md` | Full Chinese documentation |
| `examples/AGENTS.md` | Project-root instruction example |
| `examples/safe-replace.mjs` | Safe UTF-8 exact replacement helper |
| `checklists/windows-safe-checklist.md` | Windows safety checklist |
| `checklists/lean-code-checklist.md` | Lean coding checklist |
| `scripts/validate-skill.mjs` | Zero-dependency validator |

## License

MIT. See [LICENSE](LICENSE).