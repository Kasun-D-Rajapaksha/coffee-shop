# Ember & Cream — QA test results

**Date:** 2026-10-26 (Asia/Colombo)  
**Environment:** `http://127.0.0.1:8765/` (Python `http.server`)  
**Tester:** IT Team Lead (smoke + functional pass in built-in browser)  
**Viewport:** 1280×720 (automation could not resize to mobile)

## Summary

| Verdict | Detail |
|---------|--------|
| **Smoke / functional** | **Pass** — core pages, navigation, and menu tabs work |
| **Production ready** | **Conditional** — fix favicon, replace placeholders, optional a11y polish |

**Totals:** 28 passed · 1 failed · 6 warnings · 4 not run

---

## 1. Assets & server

| ID | Check | Result |
|----|--------|--------|
| A1 | `index.html` HTTP 200 | Pass |
| A2 | `css/styles.css` HTTP 200 | Pass |
| A3 | `js/main.js` HTTP 200 | Pass |
| A4 | All 14 referenced WebP images HTTP 200 | Pass |
| A5 | `favicon.ico` | **Fail** — HTTP 404 |

---

## 2. HTML structure (static)

| ID | Check | Result |
|----|--------|--------|
| H1 | Single `<h1>` (“Your Daily Dose of Happiness.”) | Pass |
| H2 | Sections `#home`, `#about`, `#menu`, `#hours`, `#contact` | Pass |
| H3 | `lang="en"`, viewport meta, `<main>` | Pass |
| H4 | Duplicate `id` attributes | Pass (none) |
| H5 | All local `img` paths exist on disk | Pass (23 images) |

---

## 3. Navigation & CTAs (browser)

| ID | Check | Result |
|----|--------|--------|
| N1 | Desktop nav links visible (flex row) | Pass |
| N2 | “Explore Our Menu” → `#menu` | Pass |
| N3 | “Find Us” / `#contact` | Pass |
| N4 | In-page `#hours` link scrolls | Pass |
| N5 | `tel:` and `mailto:` links present | Pass |
| N6 | Get Directions → Google Maps, `target=_blank` | Pass |

---

## 4. Menu tabs (browser)

| Category | Cards | Images after tab open | Tab switch |
|----------|-------|------------------------|------------|
| Espresso | 3 | OK | Pass |
| Cappuccino | 3 | OK | Pass |
| Caffè Latte | 3 | OK | Pass |
| Americano | 2 | OK | Pass |
| Iced Coffee | 3 | OK | Pass |
| Signature | 3 | OK | Pass |
| Pastries | 4 | OK | Pass |

**Note:** Inactive tab panels use `hidden` + `loading="lazy"`; images load after the tab is opened (expected).

---

## 5. JavaScript (code review)

| ID | Check | Result |
|----|--------|--------|
| J1 | Menu tab click + `hidden` / `aria-selected` | Pass |
| J2 | Mobile nav toggle handler | Pass (code present) |
| J3 | IntersectionObserver scroll reveal | Pass (code present) |

---

## 6. Accessibility (light review)

| ID | Check | Result |
|----|--------|--------|
| X1 | Landmarks (`banner`, `main`, `contentinfo`) | Pass |
| X2 | Section `aria-labelledby` | Pass |
| X3 | Menu `role="tablist"` / `tab` / `tabpanel` | Pass |
| X4 | Tabs linked with `aria-controls` | **Warn** — not wired |
| X5 | Keyboard arrow navigation between tabs | **Warn** — not implemented |
| X6 | Full axe / screen reader pass | Not run |

---

## 7. Content & production

| ID | Check | Result |
|----|--------|--------|
| P1 | Placeholder contact / social clearly tagged | Pass |
| P2 | Real business details | **Warn** — still placeholders |
| P3 | Some menu photos reused across items | **Warn** — template quality |
| P4 | Unsplash license review for go-live | Not run |
| P5 | Deploy + HTTPS + domain | Not run |

---

## 8. Responsive / mobile

| ID | Check | Result |
|----|--------|--------|
| R1 | CSS breakpoints `@media (min-width: 768px)` | Pass (code present) |
| R2 | Mobile hamburger + overlay at ≤767px | **Not run** — browser stayed 1280px wide |
| R3 | Tablet (768–1024px) visual pass | Not run |

---

## 9. Performance

| ID | Check | Result |
|----|--------|--------|
| L1 | Lighthouse / Core Web Vitals | Not run |
| L2 | Google Fonts external dependency | Warn — requires network at runtime |

---

## Recommended fixes before production

1. Add `favicon.ico` (or `link rel="icon"` to a WebP/PNG).
2. Replace placeholder address, phone, email, Instagram, Facebook.
3. Manually verify mobile nav on a phone or narrow devtools once.
4. Optional: `aria-controls` on tabs, keyboard support, `prefers-reduced-motion` media query.
5. Deploy static folder to host of choice; enable HTTPS on custom domain.

---

## Sign-off

**Functional smoke test: PASSED.**  
**Production release: NOT APPROVED** until favicon + real content + mobile spot-check (minimum).
