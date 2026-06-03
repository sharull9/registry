# Architecture and File Ownership

## Feature-first structure

- `src/modules/<feature>/` is the default home for feature code.
- Each feature module owns its `schema/`, `hooks/`, `util.ts`, `ui/layouts/`, `ui/views/`, and `ui/components/`.
- Keep feature-specific backend API code inside the same feature module under `src/modules/<feature>/api/`.

## Shared layers

- `src/app/` contains Next.js App Router entries.
- `src/components/ui/` contains generated shadcn/ui primitives. Do not edit generated components directly.
- `src/providers/` contains app-wide React providers used by the root layout.
- `src/constants.ts` contains locale constants and shared app constants.

## Imports

- Use the `@/*` path alias for `./src/*`.
