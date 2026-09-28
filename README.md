# RenewVan

Marketing landing page for RenewVan — Next.js App Router + Tailwind v4 + shadcn/ui, deployed to Cloudflare Workers via OpenNext.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com) v4
- [shadcn/ui](https://ui.shadcn.com) — style `new-york`, base color `neutral`
- [Biome](https://biomejs.dev) for linting/formatting (no ESLint)
- [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) + [Wrangler](https://developers.cloudflare.com/workers/wrangler/) for Cloudflare Workers deployment

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Linting & formatting

```bash
pnpm lint      # biome check
pnpm format    # biome format --write
```

## Deploying to Cloudflare

This project deploys as a Cloudflare Worker (via OpenNext), not a static export.

```bash
pnpm run preview   # build + preview locally against a Wrangler dev server
pnpm run deploy    # build + deploy to Cloudflare Workers
```

Requires `wrangler login` once per machine. Worker config lives in `wrangler.jsonc`; OpenNext config in `open-next.config.ts`.

## Adding shadcn components

```bash
pnpm dlx shadcn@latest add <component>
```

## Project layout

- `app/` — routes, layout, global styles
- `components/` — page sections (`hero.tsx`, `navbar.tsx`, `logo.tsx`, `background-pattern.tsx`, `nav-menu.tsx`) and `components/ui/` (shadcn primitives)
- `lib/utils.ts` — `cn()` class-merge helper
