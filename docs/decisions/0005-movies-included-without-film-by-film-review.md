# 0005 Movies are included without a film-by-film review; visitors' votes flag doubtful items

Date: 2026-11-23, 22:18 UTC. Decided by Adam, in the Movies thread:

> I think you understand what i expect covered on the site. I dont want to go movie by movie and decide. Just include all
> the movies you see fit, along with sources to back them up. Mentions from fans about movies having ties are okay, but
> should be verified, otherwise users can thumbs up/down items across all aspects of the site. If any items fall below 0
> thumbs up (thumbs down counteracts thumbs up and vice versa), notify me so I can decide if that item should or should
> not be removed from IntoTheTwilightZone.com.

## Decision

- **Movies records are included when they are added**, without waiting for Adam to review them one by one. That covers films
  and the connections that tie them to an episode, the show or Rod Serling. Each one still needs a source and the usual
  reason (connection, tier, recommendation), and must meet the Movies plan's rules (docs/plans/research-movies.md: a tie
  to the series, its episodes or Serling; Adam's Q1 to Q5). Their entries in data/review/decisions.json say
  "Adam 2026-11-23 22:18 UTC" in the notes. The first 18 (the wide sweep of 2026-11-23) were included this way.
- **Links noted only by fans are allowed, and should be verified**: the research rounds look for a published source or the
  makers' own words to raise each "Noted by fans" link. A link that can't be verified stays, marked "Noted by fans".
- **Visitors vote on items across the whole site** with a thumbs up or thumbs down. Up and down cancel out. When an item's
  total falls below zero, Adam is told, and he decides whether it stays. This is built with the fan accounts work
  (votes need accounts to stop one person voting many times); see that work's plan.

## Why

Adam has set the scope rules for Movies (the plan and his answers Q1 to Q5) and trusts them to be applied. A vote from
the site's visitors is a better check on a weakly sourced link than a review queue that waits on one person.

## Set aside

- **Keeping every new Movies record pending until Adam reviews it**: Adam asked not to go film by film.
- **Dropping links noted only by fans**: Adam said they are okay; the vote is the check.
