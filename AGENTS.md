# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project overview

`eris-frontend` is an early-stage single-page application (SPA) frontend built with React 19, TypeScript, and Vite 8. It was scaffolded from the official Vite `react-ts` template and is still minimal: a placeholder `Home` page and a `Struct` page (split view — tree on the left, table on the right, separated by a draggable splitter) behind a shared layout with a side navigation bar. Google Material Design 3 theming (via Material Theme Builder) is wired through CSS custom properties; the light scheme is applied via `class="light"` on `<html>` in `index.html`.

The package manager is **Bun** (lockfile: `bun.lockb`; scripts run Vite through `bunx --bun`).

## Repository layout

```
index.html                  HTML entry; mounts #root via /src/app/main.tsx,
                            loads the Material Symbols font from Google Fonts,
                            applies the Material light scheme (class="light")
vite.config.ts              Vite config: react plugin + "~" alias to ./src
tsconfig.json               Solution file with project references only
tsconfig.app.json           TS config for src/ (bundler mode, strict linting)
tsconfig.node.json          TS config for vite.config.ts only
eslint.config.js            ESLint flat config
material-theme.json         Material Theme Builder export (seed #2196F3),
                            source of truth for the generated theme CSS
src/
  app/                      Application shell
    main.tsx                Bootstrap: createRoot + <StrictMode>, imports ./styles
    App.tsx                 RouterProvider + Layout (NavBar + Outlet, flex row)
    routes/index.tsx        Route table: createRouter(createBrowserRouter) with
                            the layout route and child page routes
    ui/                     Shared app UI
      NavBar.tsx            Side navigation (react-router Links, Material Symbols)
      NavBar.module.css     NavBar styles (CSS Module, BEM-style names)
      index.ts              Barrel: re-exports NavBar
    styles/
      index.ts              Imports all global CSS (main, variables, material)
      main.css              Global styles (font rendering, resets)
      variables.css         Custom design tokens (border radii), scoped to .body
      material/             Generated Material 3 color schemes as CSS custom
                            properties (--md-sys-color-*): light/dark x default/mc/hc
  features/                 Feature modules (components + local state)
    struct/                 Building blocks of the Struct page
      api.ts                Mock API: StructNode tree, fetchStructTree() and
                            fetchStructRecords() with simulated network delay
      Splitter.tsx          Two-pane split container with a draggable divider
                            (Pointer Events; ArrowLeft/ArrowRight/Home keys)
      StructTree.tsx        Expandable node tree with selection
      StructTable.tsx       Records table with status chips
      index.ts              Barrel: re-exports the three components
  pages/                    Route pages; one file per page
    Home.tsx                Placeholder page
    Struct.tsx              Struct page: Splitter(tree | table) fed by the mock API
    Struct.module.css       Page layout styles
    index.ts                Barrel: re-exports pages as named exports
  assets/                   Static images (hero.png, react.svg, vite.svg)
public/
  favicon.svg               Site icon
  icons.svg                 SVG sprite (<symbol> definitions)
```

## Commands

| Command         | What it does                                                        |
| --------------- | ------------------------------------------------------------------- |
| `bun install`   | Install dependencies (Bun)                                          |
| `bun run dev`   | Start the Vite dev server with HMR                                  |
| `bun run build` | Type-check (`tsc -b`) then production build to `dist/`              |
| `bun run lint`  | Run ESLint over the repo                                            |
| `bun run preview` | Serve the production build from `dist/` locally                   |

### Known issue: `bun run build` currently fails

`tsc -b` errors with TS5101 because TypeScript 6.0.2 deprecates the `baseUrl`
compiler option used in `tsconfig.app.json` and `tsconfig.node.json` (paths can
be made relative instead). `bunx --bun vite build` alone succeeds and emits a
working bundle. Verify changes with `vite build` until the tsconfigs are fixed.

## Runtime architecture

- Pure client-side SPA; `index.html` loads `src/app/main.tsx` as an ES module.
- Routing uses `react-router` v8: the route table lives in
  `src/app/routes/index.tsx` (`createRouter` builds one `createBrowserRouter`
  instance and caches it), rendered through `RouterProvider` from
  `react-router/dom` in `src/app/App.tsx`. One layout route renders `NavBar` +
  `<Outlet>`; children: `/` → `Home`, `/struct` → `Struct`. Because routing is
  client-side, static hosting needs an SPA fallback to `index.html`.
- React runs in `<StrictMode>`; data loading in effects must handle double
  invocation (cancellation flags, idempotent fetches).
- Icons come from the Material Symbols Outlined web font (linked in
  `index.html`, referenced via `<span className="material-symbols-outlined">`).

## Code style guidelines

- **Path alias**: import app code via `~/...`, which maps to `./src` in both
  `vite.config.ts` (resolve.alias) and the tsconfig `paths`.
- **Barrel files**: directories expose modules through `index.ts` barrels that
  re-export default exports as named ones (see `src/pages/index.ts`,
  `src/app/ui/index.ts`). Follow this when adding pages/modules.
- **Styling**: component-scoped styles use CSS Modules (`*.module.css`) with
  BEM-style class names (e.g. `.navigation__list`); global styles live in
  `src/app/styles/main.css`. Material 3 colors come from the CSS custom
  properties in `src/app/styles/material/*.css` — the light scheme is active
  via `class="light"` on `<html>`; reference tokens as
  `var(--md-sys-color-*, fallback)` so components still render if the theme
  class changes.
- **Formatting** (as used in handwritten sources): double quotes, semicolons,
  2-space indent in TS/TSX.
- **TypeScript is strict**: `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`, `verbatimModuleSyntax` (use `import type` for
  type-only imports), `erasableSyntaxOnly`, `noEmit`, bundler module resolution.
  The build must stay free of type errors and unused-symbol warnings.
- **ESLint** (flat config): js recommended + typescript-eslint recommended +
  react-hooks recommended + react-refresh/vite preset; `dist/` is ignored.
  `react-hooks/set-state-in-effect` is enforced: no synchronous setState in
  effect bodies — load data in async callbacks and reset state in event
  handlers.

## Testing

There is no test framework configured (no Vitest/Jest/Playwright). The only
automated checks are `bun run lint` and the `tsc -b` type-check inside
`bun run build`. When adding tests, follow the Bun/Vite ecosystem convention
(Vitest) and wire a `test` script into `package.json`.

## Deployment

No CI pipelines, Docker files, or deploy scripts exist yet. `vite build`
produces a static site in `dist/` that can be hosted by any static file server
(with SPA fallback for client-side routes).

## Security considerations

- No secret management or environment variables are in use; do not introduce
  `.env` files or hardcoded credentials.
- `index.html` fetches the Material Symbols font from Google Fonts at runtime —
  a third-party network dependency. Self-host the font if that becomes a concern.
