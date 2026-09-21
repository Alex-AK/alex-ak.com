---
title: How to make a bug class impossible to reintroduce
description: An audit, an auto-fixer, a lint rule, a CI gate, and then you delete the tooling.
published: 2026-10-01
draft: true
---

> Outline only. Source material is the schema drift program in the
> accomplishments record. Employers named, internals not.

Most teams fix bugs one at a time. Some bugs are worth fixing as a class.

## The shape of a class bug

What makes a defect a class rather than an incident. The tell is that fixing
one instance teaches you nothing about how many others exist.

## Measure before you argue

Count the offenders first. A number turns "we should clean this up" into a
proposal somebody can approve or reject.

## The five pieces

1. An audit that reports drift without changing anything.
2. An auto-fixer for the cases that have one obvious answer.
3. A lint rule strict on new code, grandfathering what's already there.
4. Something that speaks up in review.
5. A CI check that fails on regression.

The order matters. Enforcement before the cleanup finishes just blocks
everybody.

## Build it to be deleted

The tooling is scaffolding, not architecture. Say up front what makes it safe
to remove, and what the repo looks like the day it goes.

## What this costs

Honest accounting of the months, and why it was still cheaper than the
alternative.
