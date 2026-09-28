---
name: DevCenter
description: A developer's private mission-control desk for tasks, notes, projects and tools.
colors:
  console-ground: "#0a0f0d"
  console-ground-light: "#f3efe4"
  panel-steel: "#101613"
  panel-steel-light: "#fbf9f3"
  panel-steel-raised: "#141c18"
  panel-steel-raised-light: "#ffffff"
  hairline-steel: "#232f29"
  hairline-steel-light: "#d9d0ba"
  hairline-steel-strong: "#34483f"
  hairline-steel-strong-light: "#bdb097"
  readout-phosphor: "#eaf6ea"
  readout-phosphor-light: "#171510"
  readout-phosphor-dim: "#7fa08d"
  readout-phosphor-dim-light: "#6b6151"
  phosphor-accent: "#39ff6a"
  phosphor-accent-light: "#17803e"
  phosphor-accent-deep: "#1f9b4c"
  warning-amber: "#ffab4a"
  warning-amber-light: "#a35a12"
  alert-red: "#ff6b6b"
  alert-red-light: "#b3261e"
typography:
  display:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    letterSpacing: "0.04em"
rounded:
  none: "0"
  xs: "1px"
  sm: "2px"
  md: "3px"
  lg: "4px"
  xl: "6px"
spacing:
  3xs: "2px"
  2xs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  panel:
    backgroundColor: "{colors.panel-steel}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  nav-item-active:
    backgroundColor: "{colors.hairline-steel}"
    textColor: "{colors.readout-phosphor}"
    rounded: "{rounded.none}"
  tag-danger:
    backgroundColor: "{colors.alert-red}"
    textColor: "{colors.readout-phosphor}"
    rounded: "{rounded.sm}"
  tag-warn:
    backgroundColor: "{colors.warning-amber}"
    textColor: "{colors.console-ground}"
    rounded: "{rounded.sm}"
---

# Design System: DevCenter

## Overview

**Creative North Star: "The Mission Control Desk"**

DevCenter reads as a real instrument console, not another rounded-card SaaS
dashboard. The product's own name — Command Center — is taken literally: a
developer's daily tasks, notes, projects and tools surface as telemetry on a
dim, glowing desk, the way an operator reads status off a panel rather than
scrolling a feed. Density and precision come first; ornament does not.

Dark ("console") is the native, default scheme — a room lit mostly by its
own panels. Light ("daylight desk") is a genuine second rendition, not an
inverted palette: brushed-steel panels on warm paper under daylight, ink
readouts instead of glowing phosphor. Both share the same structure, radii,
spacing and component language; only the material and glow change.

**Key Characteristics:**
- Near-black or warm-paper ground, never the default cool slate/gray SaaS neutral.
- Squared, hairline-bordered panels — no soft rounded shadow cards.
- Monospace reserved strictly for numerals, timestamps, and durations.
- One accent (phosphor green) carries state; amber and red are reserved for
  warning/overdue signals only, never decoration.

## Colors

A single-accent system: a dark or warm-paper neutral ground, phosphor green
as the one chromatic accent, amber and red reserved for status only.

### Primary
- **Phosphor Accent** (`#39ff6a` dark / `#17803e` light): the one accent —
  active nav indicator, active status lights, primary buttons, links,
  "ACTIVE" project tags, focus rings. Used sparingly; its rarity is the point.
- **Phosphor Accent Deep** (`#1f9b4c`): hover/pressed state of the accent, and
  the PrimeVue `primary.500` step used against light-mode grounds.

### Neutral
- **Console Ground** (`#0a0f0d` dark / `#f3efe4` light): the page background.
- **Panel Steel** (`#101613` dark / `#fbf9f3` light): every panel, the nav
  rail, the topbar and the command dock.
- **Panel Steel Raised** (`#141c18` dark / `#ffffff` light): floating overlays
  only (the command palette dialog) — never a static in-page panel.
- **Hairline Steel** (`#232f29` dark / `#d9d0ba` light): panel borders and row
  dividers.
- **Hairline Steel Strong** (`#34483f` dark / `#bdb097` light): input borders,
  kbd-badge borders, hover border states.
- **Readout Phosphor** (`#eaf6ea` dark / `#171510` light): primary text.
- **Readout Phosphor Dim** (`#7fa08d` dark / `#6b6151` light): secondary/body
  text (project names, empty-state copy, kbd hints) — the dimmest tier that
  still clears 4.5:1 body-text contrast. A near-invisible fourth tier exists
  only for non-text decoration (idle status dots, disabled icons) and must
  never carry real copy.

### Named Rules
**The One Accent Rule.** Phosphor green is the only chromatic accent. Amber
and red exist solely as status signals (overdue, warning, high priority) and
are never used decoratively.

**The Two Text Tiers Rule.** Any string a person needs to actually read uses
`readout-phosphor` or `readout-phosphor-dim`, never the fourth, dimmest gray —
that tier is reserved for non-text decoration only.

## Typography

**Display/Body Font:** IBM Plex Sans (self-hosted via `@fontsource`)
**Label/Mono Font:** IBM Plex Mono (self-hosted via `@fontsource`)

**Character:** A technical, engineering-catalog pairing — Plex Sans reads
plainly for prose, Plex Mono marks anything that is a measurement (a count,
a clock, a duration, a date) rather than a sentence.

### Hierarchy
- **Display** (600, 1.75rem, 1.2 line-height, -0.02em tracking): page-level
  greeting heading only (`<h1>` on the dashboard).
- **Title** (600, 0.9375rem): panel headings ("Bitácora de tareas").
- **Body** (400, 0.8125rem, 1.5 line-height): task titles, list content, copy.
- **Label** (500, 0.6875rem, 0.04em tracking, uppercase): readout labels,
  command-palette group headers, kbd hints.

### Named Rules
**The Measurement-Only Mono Rule.** `IBM Plex Mono` is used exclusively for
numerals, clocks, dates and durations (`.dc-mono`, `font-variant-numeric:
tabular-nums`) — never as a generic "technical-looking" costume over prose.

## Layout

A fixed 220px instrument nav rail (collapsing to a 56px icon-only rail at
≤860px) plus a flexible content column: a 52px topbar, scrollable main
content, and a 44px command dock anchored to the bottom, always visible.
Dashboard content is a two-column grid (Tasks console 2fr / Tools+Notes 1fr)
that collapses to a single column at ≤1100px. Density is high by design —
this is an operating tool, not a marketing page.

## Elevation & Depth

Mostly flat: hairline borders define every surface's edge, not shadow. The
**one exception** is a floating overlay (the command palette) which alone
carries a real offset+blur shadow, because it genuinely floats above the
page. A static in-page panel never combines a border with an ambient shadow.

### Shadow Vocabulary
- **panel-inset** (`inset 0 1px 0 rgba(255,255,255,0.6)` light /
  `rgba(255,255,255,0.04)` dark): a thin top highlight on recessed instrument
  readouts (the console-header gauge tiles), simulating a physical bevel.
- **overlay-float** (`0 1px 2px rgba(0,0,0,.5), 0 8px 20px rgba(0,0,0,.35)`
  dark / lighter equivalent in light mode): the command palette dialog only.

### Named Rules
**The Border-Or-Shadow Rule.** A static panel declares elevation with a
hairline border. A shadow is reserved for things that are genuinely floating
above the page (dialogs, popovers) — never both on the same element.

## Shapes

Squared, instrument-panel radii — never the soft "rounded SaaS card" default.
`rounded.md` (3px) is the default for panels and buttons; `rounded.lg` (4px)
for dialogs; `rounded.sm` (2px) for tags and small controls. Borders are
always 1px hairlines; there is no thick or colored border-left/border-right
accent anywhere in the system.

## Components

### Buttons
- **Shape:** 3px radius (`rounded.md`).
- **Primary:** phosphor-accent background/border, dark-console text on the
  dark scheme; text-only ("Ver todas" panel links) buttons are the default
  in dense panel headers, filled buttons reserved for real primary actions.
- **Hover / Focus:** 2px solid phosphor-accent focus ring, 2px offset.

### Tags
- **Style:** small (2px radius), tinted-background + solid text, never an
  outline-only chip. `danger` = alert-red (high priority, overdue), `warn` =
  warning-amber (medium priority, paused), `success` = phosphor-accent
  (active project), `secondary` = neutral gray (low priority, no state).

### Panels
- **Corner Style:** 4px radius (`rounded.lg`).
- **Background:** Panel Steel.
- **Shadow Strategy:** none — hairline border only (see Elevation & Depth).
- **Border:** 1px, Hairline Steel.
- **Internal Padding:** `spacing.md` (16px).
- Each dashboard panel is structurally distinct for its content (a ruled
  table for tasks, a list with tags for projects, an icon-card grid for
  tools) — never a repeated identical icon+heading+text card shell.

### Navigation (Nav Rail)
- Fixed 220px rail (56px icon-only ≤860px). Items are plain rows (icon +
  label), muted text at rest; the active item gets a filled hairline-tint
  background plus a 3px phosphor-accent indicator bar on the leading edge
  (animated via `transform: scaleY()`, never `height`, to stay off the main
  thread). No stock Menubar/PanelMenu chrome — the rail is a hand-built
  component so it can carry this signature indicator.

### Command Dock (signature component)
A 44px strip anchored to the very bottom of every view: current section on
the left (with a small phosphor status dot), a "⌘K" command trigger in the
center, and a live `HH:MM:SS` mono clock on the right. It is the one
persistent, always-reachable entry point into the Command Palette, and its
ticking clock is the system's one deliberate "the console is alive" detail.

### Command Palette
- Floating dialog (`Panel Steel Raised` background, `overlay-float` shadow,
  1px `Hairline Steel Strong` border, 4px radius).
- Mono search input, uppercase mono group label, list of options with a
  green-tinted active row, and a footer of kbd hints (↑↓ / ↵ / Esc).
- Fully keyboard-operable: arrow keys move the active row, Enter selects,
  Escape closes; `role="combobox"` + `aria-activedescendant` wire the input
  to the listbox for screen readers.

## Do's and Don'ts

### Do:
- **Do** use `IBM Plex Mono` + `font-variant-numeric: tabular-nums` for any
  count, clock, date or duration.
- **Do** give every dashboard panel a materially different internal
  structure suited to its content (table, list, grid) — not a repeated card
  shell.
- **Do** reserve amber/red strictly for warning/overdue/high-priority signal,
  never as decoration.
- **Do** declare elevation with a border on static panels; reserve shadow for
  genuinely floating overlays.

### Don't:
- **Don't** add a kicker/eyebrow label above any heading.
- **Don't** combine a hairline border with an ambient drop shadow on the same
  static panel (the "ghost card").
- **Don't** use the dimmest neutral tier (`readout-phosphor-dim`'s darker
  sibling used only for the idle status dot) for any string a person needs
  to read.
- **Don't** animate `width`/`height`/`padding`/`margin` for state changes;
  use `transform`/`opacity` (see the nav rail's active indicator).
