# Ember & Cream — Design Upgrade Specification

A modern 2026 enhancement to the existing boutique coffee shop website, preserving the warm espresso-cream-caramel palette while adding micro-interactions, motion depth, and contemporary polish.

---

## Design Principles

1. **Warmth over flash** — Animations feel organic, like steam rising from a cup. Nothing jarring.
2. **Depth through subtlety** — Soft shadows, gentle lifts, and layered transparency create tactile presence.
3. **Respect for attention** — Motion draws eyes to content, never away from it.
4. **Accessibility first** — Every enhancement degrades gracefully; reduced-motion users see a fully functional site.
5. **Performance budget** — No animation should delay LCP; all effects use GPU-composited properties.

---

## CSS Custom Property Additions

Add to existing `:root` block:

```css
:root {
  /* === Existing tokens remain unchanged === */

  /* Motion tokens */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-soft: cubic-bezier(0.45, 0, 0.55, 1);
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-reveal: 700ms;

  /* Depth tokens */
  --shadow-xs: 0 1px 2px rgba(61, 35, 20, 0.04);
  --shadow-sm: 0 2px 8px rgba(61, 35, 20, 0.06);
  --shadow-md: 0 4px 16px rgba(61, 35, 20, 0.08);
  --shadow-lg: 0 8px 32px rgba(61, 35, 20, 0.10);
  --shadow-xl: 0 16px 48px rgba(61, 35, 20, 0.14);
  --shadow-glow-caramel: 0 4px 20px rgba(196, 149, 106, 0.35);
  --shadow-glow-espresso: 0 4px 20px rgba(61, 35, 20, 0.25);

  /* Glass tokens */
  --glass-bg: rgba(250, 246, 240, 0.72);
  --glass-bg-dark: rgba(61, 35, 20, 0.65);
  --glass-blur: 16px;
  --glass-border: 1px solid rgba(255, 255, 255, 0.18);

  /* Fluid type scale (clamp) */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.8125rem);
  --text-sm: clamp(0.875rem, 0.82rem + 0.28vw, 0.9375rem);
  --text-base: clamp(1rem, 0.94rem + 0.3vw, 1.0625rem);
  --text-lg: clamp(1.125rem, 1.05rem + 0.38vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);
  --text-3xl: clamp(2rem, 1.5rem + 2.5vw, 2.75rem);
  --text-4xl: clamp(2.5rem, 1.75rem + 3.75vw, 4rem);
  --text-hero: clamp(2.75rem, 2rem + 3.75vw, 4.25rem);

  /* Spacing scale */
  --space-xs: clamp(0.25rem, 0.2rem + 0.25vw, 0.5rem);
  --space-sm: clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem);
  --space-md: clamp(1rem, 0.85rem + 0.75vw, 1.5rem);
  --space-lg: clamp(1.5rem, 1.25rem + 1.25vw, 2.5rem);
  --space-xl: clamp(2.5rem, 2rem + 2.5vw, 4rem);
  --space-2xl: clamp(4rem, 3rem + 5vw, 6rem);

  /* Dark mode tokens (toggled via data-theme="dark") */
  --dm-bg: #1a1412;
  --dm-surface: #252019;
  --dm-text: #f5f0e8;
  --dm-text-muted: #a89a8c;
  --dm-border: rgba(250, 246, 240, 0.08);
}
```

---

## Component Enhancement Specs

### 1. Header / Navigation

**Current state:** Fixed header with `backdrop-filter: blur(12px)`, simple scroll shadow.

**Enhancements:**

| Property | Current | Upgraded |
|----------|---------|----------|
| Background | `rgba(250, 246, 240, 0.92)` | `var(--glass-bg)` with refined blur |
| Shadow on scroll | Single shadow | Tiered: `--shadow-sm` at 24px, `--shadow-md` at 100px |
| Logo mark | Static gradient circle | Subtle pulse on hover (scale 1 → 1.05, 600ms) |
| Nav links | Color transition only | Underline grows from center on hover |
| Mobile nav | Slide from right | Slide + stagger each link 50ms apart |

**Motion spec:**
```
Logo hover: scale(1.05), ease-out-expo, 400ms
Nav link underline: scaleX(0 → 1), transform-origin center, ease-out-quart, 250ms
Mobile nav open: translateX(100% → 0), ease-out-expo, 450ms
Mobile link stagger: translateY(20px → 0), opacity 0 → 1, delay i * 50ms, 350ms each
```

**Accessibility:**
- Keep `aria-expanded` / `aria-controls` on toggle.
- Underline animation uses `transform` only (no layout shift).
- Reduced-motion: underline appears instantly, no slide for mobile nav.

---

### 2. Hero Section

**Current state:** Full-viewport image with gradient overlay, fade-up text animation.

**Enhancements:**

| Feature | Implementation |
|---------|----------------|
| Ken Burns effect | Slow scale (1 → 1.08) + translate drift over 25s, infinite alternate |
| Parallax layer | Hero image moves at 0.3× scroll speed; text at 1× |
| Text reveal | Split headline by word, stagger 80ms per word, blur 8px → 0 + translateY |
| CTA buttons | Glow pulse on idle (caramel shadow fades in/out every 3s) |
| Progress dot | Scroll-linked dot indicator at bottom, fades at 80vh scroll |

**Motion spec:**
```
Ken Burns: scale(1.08) translateX(-2%) translateY(-1%), 25s linear infinite alternate
Headline word stagger: opacity 0 → 1, translateY(30px → 0), filter blur(8px → 0), 600ms ease-out-expo, delay i * 80ms
Eyebrow: same as current fadeUp, 800ms delay 200ms
CTA glow pulse: box-shadow opacity 0.2 → 0.5, ease-in-out-soft, 3s infinite alternate
Scroll indicator: opacity 1 → 0 as scrollY 0 → 80vh
```

**Parallax implementation (CSS scroll-driven animations):**
```css
@supports (animation-timeline: scroll()) {
  .hero-bg img {
    animation: heroParallax linear;
    animation-timeline: scroll();
    animation-range: 0vh 100vh;
  }
}
@keyframes heroParallax {
  from { transform: translateY(0); }
  to { transform: translateY(20%); }
}
```

**Accessibility:**
- `prefers-reduced-motion`: disable Ken Burns, parallax, and word stagger; show text immediately.
- Parallax uses `@supports` so non-supporting browsers get static image.

---

### 3. Menu Cards

**Current state:** Hover lifts card 6px, image scales 1.06×.

**Enhancements:**

| Feature | Implementation |
|---------|----------------|
| Resting shadow | `--shadow-sm` (softer than current) |
| Hover shadow | `--shadow-lg` + subtle caramel glow |
| Hover lift | translateY(-8px) + scale(1.015) for depth |
| Image reveal | Blur-up placeholder (tiny base64) → sharp image on load |
| Tab switch | Cards fade + slide up staggered when category changes |

**Motion spec:**
```
Card hover: translateY(-8px) scale(1.015), ease-out-expo, 350ms
Shadow transition: ease-out-quart, 300ms
Image on card hover: scale(1.06), ease-out-expo, 500ms
Tab switch out: opacity 1 → 0, translateY(0 → 16px), 200ms, all cards simultaneously
Tab switch in: opacity 0 → 1, translateY(16px → 0), 350ms ease-out-expo, stagger 60ms per card
```

**Blur-up images:**
Add `data-src` for full image; inline a 20px-wide base64 placeholder as `src`. On load, swap and apply:
```css
.menu-card-image img {
  transition: filter 400ms ease-out;
}
.menu-card-image img.loading {
  filter: blur(12px);
}
.menu-card-image img.loaded {
  filter: blur(0);
}
```

**Accessibility:**
- Card focus state mirrors hover (outline + shadow).
- Reduced-motion: instant switch, no stagger.

---

### 4. Menu Tabs

**Current state:** Pill buttons, background color swap on active.

**Enhancements:**

| Feature | Implementation |
|---------|----------------|
| Active indicator | Sliding pill background (shared element moves under active tab) |
| Hover state | Background lightens before becoming active |
| Pressed state | Scale(0.96) + darker background for tactile feedback |
| Scroll hint | On narrow screens, gradient fade at edges when tabs overflow |

**Motion spec:**
```
Sliding pill: translateX to new position, ease-out-expo, 350ms
Hover: background var(--beige) → var(--beige) with 10% darker, 150ms
Press: scale(0.96), 80ms
```

**Implementation approach:**
Use a pseudo-element positioned absolutely that moves via CSS or a small JS calculation:
```css
.menu-tabs {
  position: relative;
}
.menu-tabs::before {
  content: '';
  position: absolute;
  inset-block: 4px;
  width: var(--pill-width);
  transform: translateX(var(--pill-x));
  background: var(--espresso);
  border-radius: 999px;
  transition: transform var(--duration-normal) var(--ease-out-expo),
              width var(--duration-normal) var(--ease-out-expo);
  z-index: 0;
}
.menu-tab {
  position: relative;
  z-index: 1;
  background: transparent;
  color: var(--text-muted);
}
.menu-tab.active {
  color: var(--cream);
}
```
JS sets `--pill-x` and `--pill-width` on click.

**Accessibility:**
- Maintain `role="tablist"`, `role="tab"`, `aria-selected`.
- Visible focus ring on keyboard navigation.

---

### 5. About Section

**Current state:** Two-column grid, image hover scales 1.03×, feature cards with icons.

**Enhancements:**

| Feature | Implementation |
|---------|----------------|
| Image parallax | Slight upward drift on scroll (0.15× speed) |
| Feature cards | Glassmorphism background, icon glow on hover |
| Stagger reveal | Heading → paragraph → features, 150ms apart |

**Motion spec:**
```
Image parallax: translateY(0 → -8%), scroll-driven, 0vh–100vh range
Feature card hover: icon background glow (caramel, 0.3 opacity), scale(1.02), 300ms
Reveal stagger: heading at 0ms, first paragraph 150ms, second paragraph 300ms, features 450ms
```

**Glassmorphism for feature cards:**
```css
.about-feature {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: var(--glass-border);
  box-shadow: var(--shadow-sm);
}
.about-feature:hover .about-feature-icon {
  box-shadow: var(--shadow-glow-caramel);
}
```

---

### 6. Hours Section

**Current state:** Centered card with rows, gradient background.

**Enhancements:**

| Feature | Implementation |
|---------|----------------|
| Card material | Glassmorphism over gradient bg |
| Row hover | Subtle highlight (background shifts 2% darker) |
| Open now indicator | If JS detects current day/time, highlight that row with caramel left border |
| Decorative steam | CSS-only animated steam wisps above the card (optional flourish) |

**Motion spec:**
```
Row hover: background rgba shift, 150ms
Open indicator pulse: border-left-color opacity 0.6 → 1, 2s infinite alternate
Steam wisps: translateY(0 → -40px), opacity 0.6 → 0, 4s infinite, stagger 3 wisps 1.3s apart
```

**Steam wisp CSS (decorative, hidden from screen readers):**
```css
.hours-card::before,
.hours-card::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 24px;
  background: linear-gradient(to top, var(--caramel-light), transparent);
  border-radius: 2px;
  opacity: 0;
  animation: steam 4s ease-out infinite;
}
.hours-card::before { left: 30%; animation-delay: 0s; }
.hours-card::after { left: 70%; animation-delay: 1.3s; }
@keyframes steam {
  0% { opacity: 0; transform: translateY(0) scaleY(1); }
  20% { opacity: 0.5; }
  100% { opacity: 0; transform: translateY(-40px) scaleY(1.5); }
}
```

**Accessibility:**
- Steam is `aria-hidden` via pseudo-elements (already hidden).
- Reduced-motion: steam disabled, row highlight instant.

---

### 7. Contact Section

**Current state:** Two-column with info list and embedded map.

**Enhancements:**

| Feature | Implementation |
|---------|----------------|
| Map container | Glassmorphism border/frame effect |
| Social icons | Lift + rotate slightly on hover (5deg tilt) |
| Info list reveal | Stagger each `<li>` 100ms on scroll |
| Directions button | Glow pulse matching hero CTA style |

**Motion spec:**
```
Social icon hover: translateY(-4px) rotate(5deg) scale(1.1), ease-out-expo, 300ms
List item stagger: translateY(16px → 0), opacity 0 → 1, 400ms, delay i * 100ms
```

---

### 8. Footer

**Current state:** Dark espresso background, three-column grid.

**Enhancements:**

| Feature | Implementation |
|---------|----------------|
| Link hover | Underline slides in from left |
| Logo hover | Soft glow behind logo-mark |
| Divider line | Gradient fade at edges (not hard 1px) |
| Back-to-top | Small button fades in after scrolling past hero; smooth scroll to top |

**Motion spec:**
```
Link underline: scaleX(0 → 1), transform-origin left, 250ms ease-out-quart
Logo glow: box-shadow 0 0 0 → 0 0 24px var(--caramel-light) at 0.25 opacity, 400ms
Back-to-top fade: opacity 0 → 1 when scrollY > 100vh, 300ms
```

---

## Scroll Progress Indicator

A thin bar at the top of the viewport showing page scroll progress.

**Implementation:**
```css
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--caramel), var(--caramel-light));
  transform-origin: left;
  transform: scaleX(var(--scroll-progress, 0));
  z-index: 101;
  pointer-events: none;
}
```
JS updates `--scroll-progress` (0–1) on scroll.

**Accessibility:**
- `aria-hidden="true"` — decorative only.
- Reduced-motion: hide entirely (progress bars can cause discomfort).

---

## Dark Mode Toggle

**Approach:** A toggle button in the header that sets `data-theme="dark"` on `<html>`. Uses CSS custom property overrides.

**Button design:**
- Sun/moon icon swap with crossfade (opacity + rotate 90deg).
- Placed after nav links on desktop; in mobile nav on small screens.
- Respects `prefers-color-scheme` as default; user toggle overrides and persists to localStorage.

**Token overrides:**
```css
[data-theme="dark"] {
  --cream: var(--dm-bg);
  --beige: var(--dm-surface);
  --text: var(--dm-text);
  --text-muted: var(--dm-text-muted);
  --white: var(--dm-surface);
  --shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.35);
  --glass-bg: rgba(26, 20, 18, 0.85);
  --glass-border: 1px solid rgba(255, 255, 255, 0.06);
}
[data-theme="dark"] .site-header {
  background: var(--glass-bg);
  border-bottom-color: var(--dm-border);
}
[data-theme="dark"] .hero-overlay {
  background: linear-gradient(
    105deg,
    rgba(10, 8, 6, 0.88) 0%,
    rgba(10, 8, 6, 0.5) 55%,
    rgba(10, 8, 6, 0.3) 100%
  );
}
```

**Accessibility:**
- Button has `aria-label="Switch to dark mode"` / `"Switch to light mode"`.
- Focus visible ring in both modes.

---

## View Transitions API

For browsers supporting the View Transitions API, wrap section navigations (e.g., clicking nav links) in `document.startViewTransition()`.

**Transition style:**
```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 350ms;
  animation-timing-function: var(--ease-out-expo);
}
::view-transition-old(root) {
  animation-name: fade-out;
}
::view-transition-new(root) {
  animation-name: fade-in;
}
@keyframes fade-out {
  to { opacity: 0; transform: translateY(-8px); }
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
}
```

**Accessibility:**
- Reduced-motion: set `animation-duration: 0ms`.

---

## Loading States

### Skeleton Loaders

For dynamically loaded content (future enhancement), use skeleton placeholders:

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--beige) 25%,
    var(--cream) 50%,
    var(--beige) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius);
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Image Blur-Up

Already specified in Menu Cards section. Apply same pattern to About and Hero images.

---

## Motion Guidelines Summary

| Pattern | Duration | Easing | Use Case |
|---------|----------|--------|----------|
| Micro-interaction (hover, press) | 150–250ms | `ease-out-quart` | Buttons, links, icons |
| Card lift | 300–350ms | `ease-out-expo` | Cards, panels |
| Reveal on scroll | 500–700ms | `ease-out-expo` | Sections, content blocks |
| Stagger delay | 50–100ms per item | — | Lists, grids |
| Parallax | Scroll-driven | `linear` | Background layers |
| Decorative loop | 2–4s | `ease-in-out-soft` | Glows, steam, pulses |

### Stagger Pattern

For grids (menu cards, features), use CSS `animation-delay` with custom property:
```css
.menu-card {
  animation: revealUp 500ms var(--ease-out-expo) backwards;
  animation-delay: calc(var(--i, 0) * 60ms);
}
```
JS sets `--i` per card index, or use `:nth-child()`:
```css
.menu-card:nth-child(1) { --i: 0; }
.menu-card:nth-child(2) { --i: 1; }
/* ... */
```

---

## Accessibility Checklist

| Requirement | Implementation |
|-------------|----------------|
| **prefers-reduced-motion** | Wrap all keyframe animations and transitions in `@media (prefers-reduced-motion: no-preference)`. Provide instant or no-animation fallback. |
| **Focus indicators** | Every interactive element has `:focus-visible` outline (2px caramel, 3px offset). |
| **Color contrast** | All text meets WCAG AA (4.5:1 body, 3:1 large). Dark mode tokens tested. |
| **Motion sickness** | No infinite horizontal movement. Parallax limited to vertical. Decorative loops subtle. |
| **Semantic HTML** | Existing ARIA roles preserved. New elements use appropriate roles. |
| **Skip link** | Add visually hidden skip link to main content (if not present). |

**Reduced-motion media query template:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Implementation Priority

1. **Phase 1 — Foundation**
   - Add new CSS tokens
   - Implement fluid typography scale
   - Add shadow depth system
   - Wire up `prefers-reduced-motion` base

2. **Phase 2 — Micro-interactions**
   - Button hover/press states with glow
   - Nav link underline animation
   - Card hover enhancements
   - Social icon hover effects

3. **Phase 3 — Hero & Reveals**
   - Ken Burns background effect
   - Word-stagger headline reveal
   - Scroll progress indicator
   - Enhanced section reveals with stagger

4. **Phase 4 — Advanced**
   - Scroll-driven parallax (with `@supports`)
   - Menu tab sliding pill indicator
   - Image blur-up loading
   - Dark mode toggle

5. **Phase 5 — Polish**
   - View Transitions API integration
   - Hours section steam wisps
   - Back-to-top button
   - Final motion tuning

---

## File Deliverables for Frontend

| File | Contents |
|------|----------|
| `css/tokens.css` | New custom properties (can merge into styles.css) |
| `css/animations.css` | All `@keyframes` and motion utilities |
| `css/dark-mode.css` | Dark theme overrides |
| `js/motion.js` | Scroll progress, parallax calculations, tab pill positioning, dark mode toggle |

---

*Prepared by Forma, UI/UX Designer — October 2026*
