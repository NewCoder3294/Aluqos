# Quick filters on the analytics dashboard

## Problem statement
Analysts open the dashboard and immediately filter to last 30 days, top customers, and a single product line. They do this every day. Today it takes six clicks. Three of those clicks are inside a hidden menu nobody finds the first time.

## Goals
- Cut filter setup from 6 clicks to 1.
- Preserve last-used filter set across sessions.

## User stories
- As an analyst, I can save a filter combination and re-apply it next time I land on the page.
- As a manager, I can see who's looking at which views without asking.

## Scope
- One-click filter chips at the top of the dashboard.
- Persisted last-used set per user.

## Out of scope
- Multi-user shared filter sets (v2).

## Success metrics
- 80% of analysts apply a saved filter within 2 weeks.
- Median time to first filtered view drops from 18s to 4s.
