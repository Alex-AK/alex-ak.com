---
title: Don't fix it yourself
description: Fixing schema drift in other teams' tables myself was the fastest option, and the one least likely to last.
published: 2026-09-22
draft: true
---

Most bugs you fix once and forget. The annoying ones keep coming back in new places, and each time, someone patches that one and moves on. That's a class of bug, and the fix that lasts goes after whatever keeps letting them in.

For us it was schema drift, spread across tables owned by a lot of different teams. The fastest way out was to open all the pull requests myself and be done with it. I went the slow way instead.

I stumbled onto it when I asked TypeORM to generate a migration for a small change and it just failed. TypeORM builds migrations by comparing your entities with the database, and ours had stopped agreeing on things like whether a column could be null or which indexes existed. So we'd been writing migrations by hand, and every one of them was another chance to drift a little further.

Fixing all of it was going to be a real project. I did think about writing a script that could generate migrations around the drift, but that would've just been a comfier way to keep living with it.

And the tables weren't mine. The teams that owned them knew the edge cases, and they'd be the ones touching that code next. If I fixed their entities for them, things would look great for a while and then slowly drift again, because the team wouldn't have learned why it mattered or how to check. People move between teams, too, but the tooling and the docs stay put.

Instead, I built tooling and let each team fix its own: an audit that showed each team where its tables had drifted, a fixer for the easy cases, a review bot to keep the rest moving, and a lint rule and CI check to catch anything new.

Is all that worth building? Usually not. My test is whether I can show someone the problem is real in about a minute. If I can't, it isn't big enough yet, so I fix the one in front of me and move on.

What's changed is the cost of building it. I built this with coding agents, and my guess is it would've taken ten times longer by hand, mostly because I'd have had to learn TypeORM's and Postgres's internals in depth before writing anything useful. I still had to know enough to catch the agent when it was wrong, and that part doesn't go away. So building the tooling is the cheap part now, and getting a whole org to change how it works costs what it always did.

## How to do it

**Build it in the gaps, in public.** The first version took about a week, squeezed in between projects. It lived in our tracker like any other work, and I talked about it in standup. Invisible side work looks like slacking, but visible side work looks like initiative.

**Spend the effort on the README.** Lint rules and CI config are hard to read cold. The README is what people read and the commands are what they run, so make those the pitch: here's the drift in your tables, and here's the fixer clearing the easy ones. That's what gets your own pull requests approved.

**Get a casual yes.** Before you write a formal proposal, show it to someone who can sponsor it, and walk them through what it does and why it's worth doing. For me, that casual yes turned into a slot to present it to the rest of engineering.

**Let people opt in.** An opt-in channel did more for adoption than anything else I tried. A lot of the best questions in there turned out to be about how the database works rather than the tool, and a few people got into it enough to start contributing. When a tool helps and costs almost nothing, most people will use it without being asked. So answer fast, fix whatever annoys people, and take the time to teach what's underneath.

**Warn first.** Flag each mismatch with a suggested fix, and have a bot comment in review. Let CI report it too, but don't block anyone's merge over drift they inherited. Slow another team down and they'll stop using your tool.

**Build it to be deleted.** Keep it all in one directory where you can, or in a shared package if you have many services. Once drift hits zero, make the rules strict and delete the audit and the fixer in one pull request. The lint rule and CI check stay on for good, and everything else goes.

## Slower, on purpose

It was slower than doing it myself, and that was the point. Very little of it depends on TypeORM or a staff title, either. The smallest version is a script and a README in your own team's repo.

When a team fixes its own code, it's far more likely to stay fixed.
