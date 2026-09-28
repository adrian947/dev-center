# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary user: a professional software developer (the product's own builder), working
daily at a desktop workstation, occasionally checking in from tablet/mobile. Each
account is privately scoped via Google OAuth — the product may be run by other
individual developers too, each isolated to their own data, but it is not a shared
multi-tenant workspace (no teams, no collaboration, no shared boards).

## Product Purpose

DevCenter centralizes a developer's daily working context — tasks, notes, projects,
links, activity — and a toolbox of common dev utilities (JSON, JWT, UUID, regex,
timestamp, hash, diff, color, markdown, SQL formatting, HTTP client, etc.) in one
private, self-hosted app. Success is measured by daily use replacing a scattered set
of bookmarked tools, notes apps, and to-do lists.

## Positioning

Unifies two things competitors keep separate: a personal productivity command center
(tasks/notes/projects/links) and a developer toolbox that runs entirely client-side
wherever technically possible (JSON/JWT/Base64/hash/regex/UUID/timestamp/color/diff/
markdown/SQL formatter never touch the backend — privacy and zero network latency by
construction, not by promise). A neighboring to-do app or a neighboring online-JSON-
formatter site could not truthfully claim either half of that combination.

## Operating Context

Used at a developer's desk across a normal workday: switching between writing code,
decoding a JWT from a bug report, formatting a JSON payload, checking today's tasks,
jotting a technical note, and jumping to a project's related links — without leaving
the app or trusting a random public web tool with tokens/secrets. Command palette
(Ctrl/Cmd+K) is the expected fast path between all of these. Dark mode is a default
expectation, not a nice-to-have, for a developer-facing tool used for long stretches.

## Capabilities and Constraints

- Auth: Google OAuth only; no email/password. Own JWT issued in an httpOnly cookie
  after the OAuth handshake (see backend `src/config`).
- Data model so far: only `User` exists (id, googleId, email, name, avatarUrl).
  Task/Note/Project/Link/Activity/FavoriteTool/RecentTool are modeled in the plan
  but **not yet implemented in the backend** (Prisma schema, migrations, or API) —
  the dashboard being designed now has no real API to read from yet.
- i18n: Spanish default, English supported, `vue-i18n`, every visible string must go
  through translation keys (no hardcoded UI text).
- Deploy: single Express service serves the API and the built Vue static bundle
  (same origin in prod and in dev via a Vite proxy) — no separate frontend domain,
  no CORS in production.
- Design system: PrimeVue (Aura preset) is the committed component library; no
  competing component library.

## Brand Commitments

Name: "DevCenter". No existing logo, color palette, or typographic identity — the
current `frontend/src/style.css` tokens are placeholder scaffold values, not a
confirmed visual world (open for new-work to define).

## Evidence on Hand

No real tasks/notes/projects/links data exists yet (backend CRUD not built). The
dashboard must be designed against representative placeholder/mock content and
sensible empty states, not wired to live endpoints yet. No screenshots, testimonials,
or brand assets exist. State: pre-launch, single early user (the builder).

## Product Principles

1. Client-side-first for anything that can be: never send sensitive content (tokens,
   secrets, arbitrary JSON) to the backend when the browser can do the job.
2. High information density over whitespace-heavy marketing polish — this is a tool
   for daily operating use, not a page trying to persuade a visitor.
3. One coherent design system (PrimeVue-based), not a patchwork of ad-hoc components.
4. Every visible string is translatable; Spanish is the default, English is not an
   afterthought.
5. Keyboard-first: command palette and standard navigation must work without a mouse.

## Accessibility & Inclusion

No formal compliance level (e.g. WCAG AA) has been mandated. Baseline expectation:
semantic HTML, visible focus states, keyboard-operable controls and command palette,
accessible form labels — good practice by default, not a certified target.
