# Source of Truth Rules

## Prefer code over prose

- If documentation conflicts with repository code or config, follow the code or config.
- When updating AGENTS docs, only include instructions that are stable, task-relevant, and verifiable from the repo.

## Canonical files

- Use `package.json` for package manager and script behavior.
- Use `src/app/layout.tsx` and `src/providers/` for provider order and app-wide provider behavior.
- Use `src/constants.ts` for static stale value.
- Use `components.json`, `src/styles/globals.css`, and `src/lib/utils.ts` for UI tooling and styling facts.

## What not to document in AGENTS

- Do not restate generated-tool metadata unless it affects implementation choices.
- Do not keep descriptive claims that can drift from config, such as theme preset names, icon library names, or RTL flags, unless you point to the canonical file.
- Do not keep commands in root AGENTS unless they are non-standard or materially useful across tasks.
