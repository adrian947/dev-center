---
version: 1
slug: "dashboard"
primary_target: "dashboard"
related_targets: []
---

# Surface Brief: Dashboard (Command Center)

## Scope & mode

Main authenticated landing view after login — the "Command Center" home dashboard
(Sidebar + Topbar + Main content shell, plus the dashboard content itself). Mode:
**Operate**.

## Audience, job, content, constraints

Audience: a professional developer at their own desk, daily use. Job: scan today's
state (pending/overdue/today tasks, active projects, recent notes, recent tools) and
jump to action fast via the command palette, never hunting through generic nav.

No live API exists yet (Task/Note/Project/Link backend is not built — Fase 4).
Build against representative mock data plus real, deliberate empty states; nothing
here is wired to a real endpoint yet. Must sit on PrimeVue's real primitives (Card,
table, Button, Tag, Menu, Avatar) restyled in the chosen world's vocabulary, never
decorative-only chrome floating over stock components. Every visible string goes
through vue-i18n (es default, en supported). Dark mode is this world's native mode;
a light/"daylight desk" instrument variant must still exist, translated in its own
vocabulary rather than a simple color inversion.

## Direction contract

**THESIS:** The Command Center is a real mission-control desk, not another SaaS
admin shell — the product's own name taken literally as one operator's instrument
panel, refusing the sidebar + KPI-card + soft-shadow dashboard every category ships.

**OWN-WORLD:** Near-black console ground (`#0c1210`) with pale phosphor-green
readout text (`#eaf6ea` / `#39ff6a`) and an amber warning accent (`#ff7a1a`); panels
read as painted steel with backlit toggle-style controls; PrimeVue components
restyled as bordered instrument clusters — squared corners, hairline dividers,
monospace numerics for counts/timestamps/clocks, sans for body copy — never rounded
soft-shadow cards.

**STORY:** On login the operator's desk lights up: a status strip first (date as a
mission clock), then instrument clusters reporting Tasks/Projects/Notes/Tools
telemetry at a glance. Counts read as readouts, state reads as color-coded lights,
and action happens through the command strip (⌘K) the way an operator throws a
switch — never through a generic nav hunt.

**FIRST VIEWPORT:** Full-bleed status strip at top (date + greeting as a mission-
clock readout). Left instrument-panel nav rail (2/12 cols). Central Tasks console
(6/12), the largest panel. Projects panel beneath it. Notes and Tools panels
flanking right (4/12 combined). Command strip anchored at the very bottom, always
reachable.

**FORM:** Mission Control / Apollo-JPL telemetry console — my own top-ranked
grounded candidate (IMPECCABLE'S PICK, position 1 of 7 on the ordered list), chosen
by the user over the assigned roll on the decision page. Seed key: `9fbf3334`.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance.

## Memorable moment

Boot-up read: the status strip lights first, then panels populate in one quick
staggered cascade — a single coordinated propagating motion (raised from the
declined Miura-fold challenger), never scattered independent per-card fades.

## Unresolved decisions

- Exact typeface pairing (mono for readouts, sans for body) — decided against real
  content during build, not guessed here.
- Light/"daylight desk" instrument variant — decided at the responsive/theming
  pass; must not default to a naive color inversion of the dark console.
