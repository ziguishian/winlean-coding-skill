# Lean Code Checklist

Use this checklist to prevent AI-generated code from becoming larger than the task requires.

## Context Control

- [ ] Do not read `node_modules/`, `.git/`, `dist/`, `build/`, `out/`, `.next/`, `.nuxt/`, `coverage/`, `.cache/`, `.turbo/`, `.vite/`, `vendor/`, or `generated/` by default.
- [ ] Do not read lock files unless dependency resolution matters.
- [ ] Do not read binary files, images, or compressed files unless the task requires them.
- [ ] Search first, then open only relevant files or snippets.
- [ ] Stop reading once the implementation path is clear.

## Dependency Decision

- [ ] Check framework official capabilities first.
- [ ] Check official recommendations.
- [ ] Check mature open-source libraries for common solved problems.
- [ ] Check existing project dependencies.
- [ ] Check existing utilities, hooks, services, adapters, components, validators, and formatters.
- [ ] Use small local code only when framework, library, and project reuse are not a better fit.
- [ ] Use large handwritten code only when no suitable library or existing code fits.

## Public Library Scout

- [ ] Ask whether the problem is common.
- [ ] Ask whether a mature public library solves it.
- [ ] Ask whether a framework or official source recommends an approach.
- [ ] Ask whether library use is safer, shorter, and more maintainable than handwritten code.
- [ ] Ask whether dependency cost is worth it.
- [ ] If network access is unavailable, state that external library status cannot be verified.
- [ ] Do not invent library popularity, maintenance status, versions, or official recommendations.

## Minimal Implementation

- [ ] State the smallest implementation path before editing.
- [ ] Ask whether the requested code needs to exist at all.
- [ ] Prefer one-file changes when sufficient.
- [ ] Prefer local patches over broad rewrites.
- [ ] Avoid new abstractions for possible future needs.
- [ ] Avoid new dependency additions unless the benefit is clear.
- [ ] Ask before adding a production dependency.
- [ ] For bug fixes, find the root cause instead of patching only the named symptom.
- [ ] Check sibling callers before editing a shared function.

## Bloat Prevention

- [ ] Prefer deletion over addition when behavior remains correct.
- [ ] Do not add unused helpers.
- [ ] Do not add unused types.
- [ ] Do not add unnecessary classes.
- [ ] Do not create a service layer for a small local change.
- [ ] Do not wrap framework features without a real need.
- [ ] Do not duplicate existing logic.
- [ ] Do not perform unrelated refactors.
- [ ] Add a concise ceiling/upgrade-path comment when using an intentional shortcut with known limits.

## Review

- [ ] Inspect the diff for unnecessary files.
- [ ] Inspect the diff for large accidental rewrites.
- [ ] Confirm no generated or dependency directory was changed.
- [ ] Confirm the Dependency Decision is reported.
- [ ] Leave one small runnable check for non-trivial logic when practical.
- [ ] Confirm validation ran or explain why it could not run.