# Routing Conventions

## App Router

- This app uses Next.js 16 App Router.
- Route groups include `(auth)` for login and registration pages and `(marketing)` for public pages.

## Route files

- Route `page.tsx` files should import the relevant feature view directly.
- Render the imported feature view from a named page component.
- Do not create extra `<feature>-page.tsx` wrapper files for routes.
- Do not use route-level re-export syntax such as `export { default } from "@/modules/<feature>/ui/<feature>-page"`.
