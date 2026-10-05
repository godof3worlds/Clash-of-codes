---
name: Cybernetic RPG Engine
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#1bbd85'
  on-tertiary-container: '#00452e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 22px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 1.75rem
  space-2xl: 2.5rem
---

## Brand & Style

This design system drives a gamified competitive coding universe where algorithmic mastery mirrors tactical fantasy world conquest. Built for modern software engineers, students, and competitive programmers, the aesthetic bridges a high-tech developer HUD with an immersive 16-bit fantasy world map. 

The visual style merges **Glassmorphism** with **Tactile Cyber-HUD** elements. Deep space-grade navy backdrops anchor translucent floating panels, illuminated edge borders, modular telemetry cards, and luminous neon accents. Micro-interactions evoke physical command decks: solid tactile action buttons, glowing state pips, monospaced code overlays, and holographic trophy ribbons. The emotional response is focused, rewarding, competitive, and cinematic—transforming difficult software development into an engaging conquest.

## Colors

The palette is engineered around high-contrast luminescence on deep oceanic voids:

- **Primary Canvas & Surfaces**: Deep midnight navy `#0B0F19` serves as the canvas background. Layered modular surfaces rely on `#111827` (surface-base) and `#1E293B` (surface-raised/cards). Elevated controls and sub-panels use `#283548` with a 1px border of `rgba(255, 255, 255, 0.08)` or neon glow outlines.
- **Primary Cyber Cyan (`#06B6D4` / `#00F2FE`)**: The lifeblood of the interface. Applied to active navigation items, progress arcs, primary focus states, key CTAs, and active code line indicators.
- **Secondary Arcane Violet (`#8B5CF6` / `#A855F7`)**: Used for AI mentor interfaces, machine intelligence indicators, rare quest markers, and mystic skill trees.
- **Tertiary Vitality Emerald (`#10B981`)**: Denotes positive execution, captured territories, test suite passes, online player states, and success indicators.
- **Gamified Functional Accents**:
  - **Streak & Reward Amber (`#F59E0B`)**: Dedicated to XP progress counters, daily streaks, coin caches, and territory trophies.
  - **Combat & Error Coral (`#EF4444`)**: Highlights compilation bugs, opposing clash competitors, system warnings, and failed test cases.

## Typography

The type hierarchy balances futuristic UI clarity with technical developer utility:

1. **Headlines (`Plus Jakarta Sans`)**: Delivers geometric, rounded authority. Used across screen headers, territory names, player level designations, and modal titles.
2. **Body & Interface (`Inter`)**: Neutral, dense, highly legible at small sizes. Used for task descriptions, algorithmic problem constraints, AI advice, and setting toggles.
3. **Telemetry & Code (`JetBrains Mono`)**: The technical backbone. Used for code editor regions, terminal outputs, countdown timers, player battle stats, XP increments, and micro-HUD pill badges.

## Layout & Spacing

The interface functions as a modular HUD deck optimized for high-density information architecture:

- **Desktop (1280px+)**: A 12-column layout structured with a persistent navigation dock (width: 240px), dynamic multi-pane main work area (code editor, runtime console, gamified world view), and an optional telemetry side drawer (280px–340px). Gutters set to `1.5rem` (`24px`).
- **Tablet (768px - 1279px)**: Reflows to an 8-column layout. Navigation folds into an icon rail (64px), and the battle code interface adopts stacked tab views (Problem Description / Code Canvas / Test Console). Gutters adjust to `1rem` (`16px`).
- **Mobile (< 768px)**: 4-column layout with fixed bottom action deck. Territory maps become zoomable pan-canvases, and code views prioritize execution output and micro test cards.
- **Rhythm & Padding**: Component interiors use dense spacing (`0.75rem` to `1.25rem`) to evoke specialized cockpit instrumentation without clutter.

## Elevation & Depth

Visual depth is achieved through translucent dark tiers reinforced with luminous edge halos:

- **Ground Layer (Canvas)**: Solid `#0B0F19` with a subtle 32px radial ambient mesh at the top corners (`rgba(6, 182, 212, 0.04)` and `rgba(139, 92, 246, 0.04)`).
- **Surface Level 1 (Panels & Sidebar)**: Background `#111827` at 94% opacity with `backdrop-filter: blur(12px)` and a stroke border of `1px solid rgba(255, 255, 255, 0.06)`.
- **Surface Level 2 (HUD Modules & Cards)**: Background `#1E293B` at 85% opacity, `backdrop-filter: blur(16px)`, stroke border `1px solid rgba(255, 255, 255, 0.1)`. Shadow: `0 4px 20px -2px rgba(0, 0, 0, 0.5)`.
- **Active / Interactive Glow Elevation**: Focused inputs, current island nodes, and victorious battle cards project an outer luminescence: `box-shadow: 0 0 16px rgba(6, 182, 212, 0.25), inset 0 0 0 1px rgba(6, 182, 212, 0.5)`.
- **Modals & Overlays**: `#111827` elevated with `0 20px 40px rgba(0, 0, 0, 0.75)` and framed with gradient border tracks.

## Shapes

The interface balances sleek cyber instrumentation with friendly modern curves:

- **Containers & Major Panels**: Set to `rounded-lg` (`1rem` / `16px`) to ensure modular cards retain clean perimeter channels while softening tech rigidity.
- **Interactive Controls (Buttons, Inputs, Metric Badges)**: Employ base roundedness of `0.5rem` (`8px`) for a crisp, tactile feel.
- **Status Pills, Avatar Shields & Progress Capsules**: Pill-shaped (`9999px`) to create an immediate visual contrast against geometric data grids.

## Components

### Buttons & Interactive Controls
- **Primary Battle Button (Execute / Clash)**: Gradient fill from `#06B6D4` to `#00F2FE` with dark foreground text (`#08202F`, weight 700). Active hover triggers `box-shadow: 0 0 16px rgba(6, 182, 212, 0.45)`.
- **Secondary Tactile Button (Generate / Hints)**: Dark slate `#1E293B` with border `1px solid rgba(139, 92, 246, 0.4)` and lavender text `#A855F7`. Hover triggers background `#283548`.
- **Success / Run Action**: Emerald gradient `#10B981` with white bold typography for test verification.

### Status Chips & HUD Telemetry Badges
- Miniature container with `padding: 4px 10px`, `rounded-full`, and mono typography (`label-caps`).
- Streaks use amber flame tint: `rgba(245, 158, 11, 0.15)` fill with `#F59E0B` text and matching left-aligned spark icon.
- Difficulty indicators: Easy (`#10B981`), Medium (`#F59E0B`), Hard (`#EF4444`).

### Code Canvas & Test Suite Runner
- Monospace editor container on `#0D131F` background with subtle line-number rails.
- Test case tabs styled with tab pills: active cases show pass pips (emerald checkmark), while running tests pulse in cyan.

### Island Territory Nodes & Progress Maps
- Floating hexagonal or circular archipelago pins connected via animated cyan dashed SVGs.
- Captured territories feature emerald aura circles, locked nodes show subtle metallic padlock badges, and active targets pulse with radar rings.

### Inputs & Selectors
- Background `#111827`, border `1px solid rgba(255, 255, 255, 0.12)`, text `#F8FAFC`. Focus transitions the border to `#06B6D4` with an inner 2px ambient cyan glow ring.

### Cards & HUD Modules
- Header with category indicator, title in `Plus Jakarta Sans`, and right-side mono metric tag. Dividers use subtle micro-gradients rather than solid rules (`linear-gradient(90deg, rgba(255,255,255,0.08), transparent)`).