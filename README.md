# alex-ak.com

My personal site. Astro, no framework, no CSS library.

```bash
pnpm install
pnpm dev      # localhost:4321
pnpm build    # → dist/
pnpm check    # types and Astro diagnostics
```

## Writing a post

Add a markdown file to `src/content/writing/`. The filename is the URL.

```markdown
---
title: How to make a bug class impossible to reintroduce
description: An audit, an auto-fixer, a lint rule, a CI gate, and then you delete the tooling.
published: 2026-10-14
draft: true
---
```

`draft: true` keeps it out of every listing, the feed and the routes, so an
unfinished post is safe to commit. Drop the line to publish.

## How it's put together

```
src/
├── consts.ts         site metadata, nav, socials, analytics id
├── content.config.ts the writing collection's schema
├── lib/posts.ts      the only reader of that collection
├── styles/           tokens.css, then global.css
├── components/       Head, Analytics, SiteHeader, SiteFooter, Section, PostList
├── layouts/          Base (the shell), Post (a written piece)
└── pages/            index, about, writing/, rss.xml
```

Two rules hold the structure up:

**One reader per collection.** `listPosts()` in `src/lib/posts.ts` is the only
function that calls `getCollection`. It drops drafts and sorts newest first, so
the home page, the writing index, the feed and the routes cannot disagree about
what exists or what order it's in. A new surface gets the same answer for free.

**Colour and type live in `tokens.css` and nowhere else.** Components reference
`var(--accent)`, never a hex. Dark mode is a second block in that one file.

## Design

Deep green on a warm neutral ground, Newsreader throughout, one column at a
reading measure. Links carry the accent and underline on hover only, which is
the convention across my other sites.

Terracotta is deliberately absent. It's Pikos's identity colour and never takes
a functional job, so this site leaves it alone.

## Deployment

Coolify builds it on push and serves `dist/` at alex-ak.com. Analytics is
Umami, which sets no cookies and collects nothing personal, so there's no
consent banner and the site id is public by design. It only loads in production
builds.
