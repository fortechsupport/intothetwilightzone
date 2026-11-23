# 0006 A resemblance is labelled "Compared to", not "Inspired by"

Date: 2026-11-23, 22:41 UTC. Decided by Adam, in the Movies thread, answering the proposal below with "Compared to".

## Proposal

Many links were filed as "Inspired by" although their only source was a critic's or fan's comparison. The Legacy page
already promised that "A resemblance is never presented as an influence", so those links broke the site's own rule.

## Decision

- Connections have a new kind, `compared`, shown as **Compared to** on every page that lists links, and gathered on a new
  Legacy shelf, **Compared to the show** (`/homages/compared/`, flagged new).
- `inspired-by` now needs the makers' own words, or a published source that says the work was inspired by the episode or
  the show. A source that only says two works are alike makes a `compared` link.
- The confidence mark is unchanged and still says how sure we are of what the link claims: "Documented" on a `compared`
  link means published critics make the comparison.
- First pass (2026-11-23): 53 links moved to `compared`. They are every "Inspired by" link noted only by fans, except five
  whose source claims an influence rather than a likeness (Adaalat, Harvey Street Kids, Donnie Darko, Marnie, The
  Munsters); seven "documented" links whose sources are critics' comparisons (10 Cloverfield Lane, both Final
  Destination links, Midnight in Paris, Planet of the Apes and "I Shot an Arrow into the Air", Ruby Sparks, The Village);
  and two "homage" links that rest on one critic's reading (Shadow in the Cloud, Terminator 2).
- Record ids do not change, so every decision in data/review/decisions.json carries over.

## Why

It says honestly what is known. A visitor sees that critics compare Groundhog Day with "Shadow Play" without being told
the episode inspired it, and the "Inspired by" shelf keeps its meaning.

## Set aside

- Removing comparison-only links: Adam's rule is to document everything and tag it (decision 0005 adds visitors' votes).
- Fan-noted "homage" links that are really passing references or parodies (theme cues, narration spoofs). Their kind is
  a separate clean-up, on the Movies plan's "Found, for later" list.
