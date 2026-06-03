# UI and Styling

## Styling stack

- Tailwind CSS v4 is configured through PostCSS.
- Global styles and CSS variables live in `src/app/globals.css`.

## Component system

- The project uses shadcn/ui for shared UI primitives.
- `components.json` is the source of truth for shadcn configuration.
- Add components with `npx shadcn@latest add <component>`.

## Utilities

- Use `cn()` from `src/lib/utils.ts` for class merging.
- Prettier is configured to sort Tailwind classes in supported helper calls.

## Verify from config when needed

- Check `components.json` for current shadcn settings such as style preset, icon library, CSS file path, aliases, and registry configuration.
- Do not rely on prose descriptions of shadcn preset details if `components.json` says otherwise.
