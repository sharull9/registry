# Backend API Organization

## oRPC routes

- Keep feature API routers under `src/modules/<feature>/api/`.
- Register feature routers through `src/orpc/index.ts`.
- Use `publicProcedure` only for intentionally public reads or checks.
- Use `protectedProcedure` for authenticated user actions.
- Use `orgProcedure` for organization-scoped reads and mutations.
- Use `superAdminProcedure` for platform administrator actions.

## Authorization

- Treat route handlers and oRPC procedures as public entrypoints.
- Enforce authorization close to the database operation, not only in layouts or proxy.
- Check `context.orgId` and ownership before reading or mutating organization-scoped records.
- Return `ORPCError` codes for auth and not-found cases instead of leaking cross-organization existence.

## Route handlers

- Keep Next.js route handlers in `src/app/api/**/route.ts`.
- Use route handlers for webhooks and framework/library integrations.
- Use oRPC procedures for application data operations consumed by the UI.
