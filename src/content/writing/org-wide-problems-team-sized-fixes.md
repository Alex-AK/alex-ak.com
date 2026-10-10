---
title: Org-wide problems, team-sized fixes
description: What to do when a problem is in every team's code and too big for any one person or team to fix.
published: 2026-10-10
draft: false
---

I added a column to a table my team owns and generated the migration. It was full of changes I hadn't made, on tables I'd never touched.

We run Postgres with TypeORM, where every table is described in code as an entity. Change the entity, run generate, get a migration file.

But generate compares the whole schema in one pass. Every other mismatch in the codebase came along with my column.

Each mismatch was schema drift, where the entity and the database disagree about a table. The smallest case is a column type - the entity says the title column is a varchar.

```ts
@Entity('posts')
export class Post {
  @Column({ type: 'varchar', nullable: true })
  title: string | null;
}
```

The database has it as text.

```sql
CREATE TABLE posts (
  title text
);
```

Nothing breaks the day drift appears. It usually gets in through a hand-written migration that comes out a little different from the entity.

Generate does catch drift. The trouble is it fixes every mismatch it finds, and for a wrong column type, the fix is [dropping the column and adding it back](https://github.com/typeorm/typeorm/issues/3357).

```sql
ALTER TABLE "posts" DROP COLUMN "title";
ALTER TABLE "posts" ADD "title" character varying;
```

The migration runs clean and every title is gone. Reverting it puts the column type back, not the titles.
Nothing warns you, either. The drop shows up in the next person's pull request, mixed in with the column they meant to add, and if the reviewer skims past it, it ships.

Once generate's output fills up with changes nobody asked for, people stop trusting it and write migrations by hand. Each of those is another chance for drift.

When I went looking, I found drift in every team's tables.

Schema drift is a narrow problem, but problems shaped like this are common. They're in every team's code, no single team can fix them on their own, and getting rid of them takes a long cleanup with tooling behind it.

I could have tried fixing all the drift myself. Tempting, since it would've been faster.

But which side is right, the code or the database, depends on domain specifics and implementation details. Say the entity lets a user's email be null and the database doesn't. If every account needs an email, the database is right, so the entity should be updated. Or the database has an index nothing has used in years, so the right fix is dropping it. Deciding which is the job of the team that owns the table.

Even if I worked out each one myself, the decision, and everything I learned making it, would sit with me. The team that owns the table would be left working around decisions I made for them.

I could also have written a script to generate migrations around the drift, but that would've just been a comfier way to keep living with it.

What I ended up building was a set of tools that let each team find and fix its own drift.

- **A README** covers the problem, why it matters, the simple fixes, and the judgment calls, for people and for the coding agents they hand the work to.
- **An audit** lists drift by table and names each kind, like a wrong type, a nullability mismatch, or an index on only one side.
- **An autofix script** updates entities to match the database. It only changes code, so it can't lose data. Where the database is the side that's wrong, the team writes a migration instead.
- **Lint rules** flag columns without an explicit type, relations without an index, and a few other patterns. Since which side to fix is sometimes a judgment call, they only warn.
- **A CI check** compares a freshly migrated database against a baseline of known drift that's committed to the repo. If a pull request adds drift, the check goes red, but it doesn't block the merge. Some drift is on purpose, like a column halfway through a rename. Old drift stays green, because the author usually didn't cause it, and red for someone else's drift teaches people to ignore red.
- **A pull request comment** shows the author any old drift in the tables they're changing, in case they want to clean it up while they're in there.
- **An opt-in Slack channel** where teams can ask about their own drift and swap database know-how. I posted a monthly update there on how the drift was trending, which I meant to automate and never did.

Once the drift is gone, generate writes only the change you made.

Coding agents wrote most of the tools, though I still had to understand the code well enough to catch their mistakes and work through the edge cases teams ran into.

## When to take this on

I only build tooling like this when a problem reaches across teams and would take a while to fix, like a major framework upgrade or a move off a deprecated library. If it's only in my team's code, I fix it, or put it on the board and we schedule it. How much effort it gets depends on how much harm it can do. A problem that can delete data is worth everything above. One that only wastes a few minutes might be worth a lint rule and a short message.

However big the problem, the fix can start small. The smallest version is a script that shows each team its own part of the problem, plus a README good enough that any team can pick it up without help.

Handing the drift to each team was slower than fixing it all myself, and that was the point.
