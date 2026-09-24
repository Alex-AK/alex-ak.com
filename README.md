# alex-ak.com

My personal site. Astro, with no UI framework and no CSS library.

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
title: Don't fix it yourself
description: One sentence. It's also the link-preview text.
published: 2026-09-22
draft: true
---
```

`draft: true` keeps it out of every listing, the feed, and the routes, so an
unfinished post is safe to commit. Drop the line to publish.

## How it's put together

```
public/               favicon, and og.png for link previews
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
the home page, the writing index, the feed, and the routes can't disagree about
what exists or what order it's in. A new surface gets the same answer for free.

**Color and type live in `tokens.css`, and so does any spacing that repeats
across pages.** Components reference `var(--accent)`, never a hex. The only
exceptions are the two places that can't read CSS: the favicon and the
`theme-color` meta tag. Dark mode, when it comes, is one more block in that
file.

## Design

Deep green on a warm neutral ground, Newsreader throughout, and one column at a
reading measure. Links carry the accent and underline on hover only. The
reasoning behind the palette is at the top of `tokens.css`.

## Deployment

Coolify builds it on push and serves `dist/` at alex-ak.com. Analytics is
Umami, which sets no cookies and collects nothing personal, so there's no
consent banner and the site id is public by design. It only loads in production
builds.
