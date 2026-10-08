---
title: Org-wide problems, team-sized fixes
description: What to do when a problem is in every team's code and too big for any one person or team to fix.
published: 2026-09-29
draft: false
---

I added a column to one of my team's tables and generated the migration. It was full of changes I hadn't made, on tables I'd never touched.

We run Postgres with [TypeORM](https://typeorm.io/), where every table is described in code as an entity. Change the entity, run generate, get a migration file.

But generate compares the whole schema in one pass, not just the table you changed. Every other mismatch in the codebase came along with my column.

That kind of mismatch between the code and the database is schema drift. Here's a small example. The entity says the column is a varchar:

```ts
@Entity('posts')
export class Post {
  @Column({ type: 'varchar', length: 255 })
  title: string;
}
```

The database has the column as text:

```sql
CREATE TABLE posts (
  title text
);
```

Nothing breaks the day drift appears. It usually gets in through a hand-written migration that comes out a little different from the entity.

Generate does catch drift. It tries to fix every mismatch it finds, and that's the problem. For a column whose type is wrong, it drops the column and adds it back. If the column allows nulls, the migration runs clean and the data in it is gone.

Once generate's output fills up with changes nobody asked for, people stop trusting it and write migrations by hand. Every one of those is another chance for drift, and the drift builds on itself.

When I went looking, the drift ran across the whole codebase, in every team's tables.

I could have tried fixing all of it myself. Tempting, because at least then I'd know it was getting done.

But neither the code nor the database is always the side that's right. Maybe the entity says a column can be null, and the database is right that it can't. Maybe the database still has an index nothing has used in years, and the right fix is dropping it, not adding it to the entity. The team that owns the table knows, and I'd have been guessing.

Whatever I worked out while guessing would have stayed with me, and I'm not the one who writes the next migration on that table.

I could also have written a script to generate migrations around the drift, but that would've just been a comfier way to keep living with it.

TypeORM has a built-in check, `migration:generate --check`, which reports whether the whole schema has drift. It's useful when the answer is no. When every team has drift, the answer is yes forever, and nobody can act on a single yes for the whole org.

So I built tools that let each team find and fix the drift in its own tables. An audit shows a team its own drift and nothing else. A fixer clears the easy cases in one command. Lint rules suggest fixes for the rest. They only warn, since some mismatches are a judgment call. A CI check keeps new drift out. Once a schema has no drift, generate only writes the change you actually made, and people can trust it again.

Coding agents wrote most of the tools, though I still had to understand the code well enough to catch their mistakes. The tools were the small part. Most of the work went into getting teams toward zero drift.

## How I approached the change

**Get feedback before the rollout.** Follow whatever process your org has for cross-team change. If it doesn't have one, write a proposal anyway. That's how a process starts. Either way, find someone who can sponsor the work. Show them the drift in their own team's tables first, then the tooling, and ask what they'd change about your approach. My sponsor's feedback helped me refine the tools before the rest of engineering heard about them, so when I presented, people could start using them that day.

**Block new drift, show the old.** CI compares a freshly migrated database against a baseline file of every known mismatch, committed to the repo and sorted, so the same drift in a different order doesn't look new. New drift fails the check. Old drift doesn't, because the author usually didn't cause it, and a check that blocks people for someone else's drift gets worked around. The check posts the old drift as a comment on the pull request instead, next to tables the author is already changing, which is about the easiest time anyone will get to clean it up.

**Start an opt-in channel.** The lint rules and the CI check drive adoption. The channel is where people take part. They ask about their own drift, swap database know-how, and a few end up contributing. Expect a lot of questions early and a few bugs before the tools feel stable. Fix each bug as it comes in, so nobody stays stuck.

## Is it needed?

Only when the problem spans the whole org. If the problem is only in my team's code, I fix it, or put it on the board and we schedule it. My other test is whether I can show someone the problem in about a minute. If I can't, it won't make anyone else's list.

When a problem passes both tests, the fix doesn't have to start big. The smallest version is a script that shows each team its own part of the problem, and a README good enough that another team can run it without you.

Every fix gets made by someone who knows the table, and that person writes its next migration too. Handing the drift to each team was slower than fixing it all myself, and that was the point.

---

*Everything above about TypeORM is measured rather than remembered. I generated a synthetic schema of 40 tables and 177 columns, injected 98 mismatches into it at random, and ran the commands against it with TypeORM 1.1.1 on Postgres 18. Generate writes the migration file and exits clean. `--check` exits non-zero. The 38 wrong column types come back as 38 pairs of drop and add. Running the generated migration against tables with rows in them failed on the first not-null column and rolled back the whole migration; on a nullable column it succeeded and left the column empty. Check these results against your own versions before trusting them.*
