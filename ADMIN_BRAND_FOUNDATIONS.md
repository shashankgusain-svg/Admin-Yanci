# Yanci Admin Portal — Brand Foundations

**Version:** 0.1  
**Platform:** Next.js admin portal (`web-yanci`)  
**Derived from:** Yanci Mobile App Design Spec v0.1 (§§3–5 foundations)  
**Theme:** Light canvas with **dark sidebar** (admin panel spec). Dark consumer-app theme is out of scope for admin v1.  
**Status:** Applied in code — shell, shared components, and built-page chrome (see admin panel redesign).

---

## 1. Purpose and scope

This document adapts Yanci’s shared brand foundations for the **admin portal**: colors, type, spacing, shape, elevation, core chrome components, voice, and number formatting.

The consumer Flutter app remains the source of brand truth. This admin adaptation keeps the same anchors (teal, navy, mint) but shapes them for a dense data UI (sidebar shell, tables, forms, modals).

**In scope**

- Visual foundations (light theme)
- Admin component foundations (shell, buttons, inputs, tables, metrics, modals, status chips)
- Voice and formatting rules for admin copy
- Token → code mapping for `web-yanci`

**Out of scope**

- Mobile five-tab IA, Home / Discover / Invest / Portfolio / Learn screens
- Kofi mascot, retail buy/sell/deposit flows, biometric/PIN
- Flutter / ThemeData implementation
- Changing admin information architecture
- Full dark-mode build (tokens documented only)

---

## 2. Design principles

1. **Calm confidence.** Admin surfaces are quiet. One clear primary action per panel or modal. No urgency tricks.
2. **Dense and readable.** Prefer scannable tables and metrics over large marketing layouts. Hierarchy comes from type and color roles, not decoration.
3. **Same brand, different job.** Teal / navy / mint match the consumer app; chrome is admin-shaped (sidebar, not bottom tabs).
4. **Honest status.** Success, failure, pending, and warning are explicit (color + label). Never color alone for gain/loss or KYC state.
5. **Sentence case, plain language.** Labels and toasts say what happened and what to do next.

---

## 3. Brand anchors

| Anchor | Hex | Role |
|---|---|---|
| Brand teal | `#028090` | Primary CTA, active nav, links, focus |
| Brand navy | `#12213B` | Headlines, primary text |
| Brand mint | `#02C39A` | Positive emphasis, success accents |
| Amber | `#F5B841` (fill) / `#B7791F` (text) | Warning / caution |

Wordmark: “Yanci” in Inter (or existing logo asset). Tagline is **not** required in the admin chrome; login may use a short product line if needed.

---

## 4. Color tokens (light / admin v1)

Values aligned with the mobile light theme. Hex marked *(proposed)* until confirmed with an eyedropper against brand source files.

| Token | Hex | Use in admin | Tailwind / code mapping (target) |
|---|---|---|---|
| `bg.base` | `#FFFFFF` | App / content canvas alternative | Prefer white surfaces; today page uses `black-3` |
| `bg.page` | `#F5FAFA` | Main content background (mint-tint gray) | Replace `bg-black-3` on `.admin-content` |
| `bg.surface` | `#FFFFFF` | Cards, metrics, table body, modals | `bg-white` / `black-1` |
| `bg.surfaceMuted` | `#F5FAFA` | Table header bar, zebra optional | Soften today’s `primary-2` table chrome toward muted surface + accent text |
| `bg.hero` | `#E6F6F3` | Login brand panel, highlight callouts | Login left panel (today `primary-7`) |
| `border.subtle` | `#E3ECEF` | Card strokes, dividers, input borders | Replace `black-5` / hardcoded `#dcdbe1`, `#dde0e3` |
| `text.primary` | `#12213B` | Page titles, table values, amounts | Replace ad hoc `gray-900` / `black-13` for body text |
| `text.secondary` | `#5B6B80` | Supporting copy, table meta | Replace `gray-500` / `black-7` for secondary |
| `text.tertiary` | `#8B99AB` | Captions, disabled hints | Disabled labels |
| `text.onAccent` | `#FFFFFF` | Text on primary CTA / active nav | Keep `text-white` on `accent.primary` |
| `accent.primary` | `#028090` | Primary CTA, active sidebar, focus ring | Rebuild `primary` scale so **`primary-6` ≈ `#028090`** (today `#35bab2`) |
| `accent.primaryHover` | ~8% darker | Pressed / hover fill | `primary-7` / `primary-8` after rescale |
| `accent.mint` | `#02C39A` | Success emphasis, positive chips | New semantic token (do not overload `primary`) |
| `accent.navy` | `#12213B` | Strong headlines | Alias or `navy` color key |
| `gain` | `#12A150` | Positive deltas, approved | Replace raw `green-500` / `green-600` |
| `loss` | `#D92D3A` | Negative deltas, reject / destructive | Replace raw `red-500` / `red-600` |
| `warning` | `#B7791F` | Caution text; chip fill may use amber tint | Replace ad hoc `yellow-*` |
| `info` | `#2563EB` | Info chips, neutral notices | Replace ad hoc `blue-*` where semantic |

### Suggested `primary` scale (centered on `#028090`)

Regen the existing `primary-1`…`primary-10` ladder so:

- Light washes (`primary-1`…`3`) stay usable for hover rows / header bars  
- **`primary-6` = `#028090`** (CTA / active)  
- Darker steps (`primary-7`…`10`) for hover and text-on-tint  

Update hardcoded SVG fills (`#35BAB2`, `#2d9e97`, etc. under `public/icons/`) to `currentColor` or the new mid teal when implementing.

### Optional dark theme (not v1)

If admin later needs dark mode, reuse consumer dark tokens (`bg.base` `#07111F`, `accent.primary` `#00E5E0`, etc.). Do not mix dark consumer glow into light admin chrome.

---

## 5. Typography

**Family:** Inter only (admin v1). Must render **₵** (U+20B5).  
Loaded today via `next/font` in [`src/pages/_app.js`](src/pages/_app.js) and `font-inter` in [`src/globals.css`](src/globals.css).

| Style | Size / line | Weight | Admin use | Existing token |
|---|---|---|---|---|
| `display` | 36 / 40 | 700 | Rare (login hero) | Add or use raw size on login only |
| `title-l` | 28 / 34 | 700 | Login title | — |
| `title-m` | 22 / 28 | 600 | Page titles | Near `heading-3` / `heading-4` |
| `heading` | 18 / 24 | 600 | Card / table section titles | `heading-6` (18) — adjust weight to 600 |
| `body-l` | 16 / 24 | 400 | Primary body, sidebar labels | `body-1` |
| `body` | 14 / 20 | 400 | Secondary body, cells | `body-2` |
| `label` | 14 / 20 | 600 | Buttons, chips, tabs | Buttons today use `body-2` + `font-semibold` |
| `caption` | 12 / 16 | 400 | Meta, timestamps | Near `label-2` |
| `numeric-m` | 16 / 20 | 600, **tabular** | Prices, GH₵ amounts in lists | New — apply `font-variant-numeric: tabular-nums` |

**Rules**

- Sentence case only. No all-caps section labels (MetricsCard today uses `uppercase` — drop that on implement).
- Tabular figures for all money, quantities, and ID columns.
- Prefer token classes over one-off `text-sm` / `text-2xl` / `text-gray-*`.

---

## 6. Spacing, shape, elevation

### Spacing

- Base unit **4**. Scale: 4, 8, 12, 16, 20, 24, 32, 40.
- Content area padding: **24** horizontal (today `.admin-content` uses `27px` — normalize to 24).
- Card / metrics internal padding: **16**.
- Gap between cards / metric grid: **12**. Between page sections: **24**.
- Navbar height: keep **72** unless shell redesign.
- Sidebar: keep **264** expanded / **80** collapsed (icon rail). Content offset must match (`COLLAPSED_WIDTH` / `EXPANDED_WIDTH` in Sidebar).
- Minimum click target **40 × 40** for dense admin; **48 × 48** preferred for primary actions.
- Metrics cards today: fixed height `104px`, radius `10px`, `letter-spacing: 1px` — retarget to radius **16**, drop letter-spacing with uppercase labels.

### Radius

| Element | Radius |
|---|---|
| Cards, metrics, table container | 16 |
| Inputs, search, selects | 12 |
| Primary / secondary buttons | **14** (soft rectangle — not `rounded-full`) |
| Chips / status pills | 999 |
| Modals | 16 |
| Icon-only / circular controls | full (exception) |

### Elevation (light)

- Default card: `0 2px 12px rgba(18, 33, 59, 0.08)` + 1px `border.subtle`.
- Modal: stronger shadow ok; keep 1px border.
- No cyan glow on admin cards (consumer dark-only pattern).

---

## 7. Component foundations (admin)

These describe the **intended** look. Paths are current implementation targets.

### 7.1 App shell

| Piece | Spec | Code today |
|---|---|---|
| Top bar | White surface, bottom `border.subtle`, global search, admin identity chip | [`Navbar.jsx`](src/components/navbar/Navbar.jsx) |
| Sidebar | Dark rail `#0B1526`; active = `sidebar.active` + mint accent bar; idle = `sidebar.text` | [`Sidebar.jsx`](src/components/sidebar/Sidebar.jsx) |
| Content | `bg.canvas` `#F6F8FA` | [`layout.jsx`](src/components/layouts/layout.jsx) |

### 7.2 Buttons — [`Button.jsx`](src/components/button/Button.jsx)

| Type | Style |
|---|---|
| Primary | Solid `accent.primary`, `text.onAccent`, height 48, radius 14, `label` weight |
| Secondary | 1.5px `accent.primary` outline, transparent/white fill |
| Destructive | Outline or solid `loss` (“Delete”, “Log out”, “Reject”) |
| Text | Accent color, no container (“See all”, “Cancel”) |
| Table / compact | Smaller padding, radius 12, border `border.subtle` — replace uppercase `table` design |
| Disabled | 40% opacity |
| Loading | Inline spinner, width locked (already supported via `isLoading`) |

**Change from today:** drop default `rounded-full` and `hover:scale-[95%]` as the primary motion; use 150ms color/opacity press feedback instead.

### 7.3 Inputs — [`inputandlabel/*`](src/components/inputandlabel/)

- Height ~48; radius 12; border `border.subtle`; focus ring `accent.primary` (2px).
- Label above: `body` / medium, `text.primary`.
- Avoid fixed 375px width where layout should be fluid (`.custom-input` today).

### 7.4 Search — [`Searchbar.jsx`](src/components/searchbar/Searchbar.jsx)

- Height 32–40; radius 12; magnifier left; border `border.subtle`.

### 7.5 Metrics cards — [`MetricsCard.jsx`](src/components/metricsCard/MetricsCard.jsx)

- Surface card, radius 16, padding 16, border `border.subtle`.
- Label: caption / secondary, **sentence case**.
- Value: large numeric, `text.primary`, tabular.
- Delta: `gain` / `loss` + sign (+/−) + triangle (already partially there). Prefer **GH₵** over `$` when showing cedi amounts (`isDollar` → currency prop later).

### 7.6 Tables — [`table/*`](src/components/table/)

- Container: white surface, radius 16, subtle border.
- Header: muted surface or very light primary wash; header text `heading` / `text.primary` or `accent` — avoid heavy teal blocks if they fight density.
- Cells: `body`, `text.primary`; meta in `text.secondary`.
- Row hover: `primary-1` or `bg.page`.
- Empty state: one centered line + optional secondary action (spec’d in hardening plan).

### 7.7 Status chips / tags

| State | Style |
|---|---|
| Success / approved | `gain` text on ~12% gain tint |
| Danger / rejected | `loss` text on ~12% loss tint |
| Warning / pending | `warning` text on amber tint |
| Info / neutral | `info` or secondary on muted fill |

Pill radius 999. Always include a text label, not color alone.

### 7.8 Modals — [`modal/*`](src/components/modal/)

- Overlay: navy/black at ~50% opacity.
- Panel: white, radius 16, max-widths already in Tailwind (`confirmation`, `details`, etc.).
- One primary + one secondary/destructive action in footer.

### 7.9 Toasts

- Keep `react-toastify`; style to brand (success → mint/gain, error → loss).
- Errors state what happened and what to do; no apologies.

### 7.10 Login — [`login/index.jsx`](src/pages/login/index.jsx)

- Left: `bg.hero` or brand teal panel; wordmark + short line; real product copy (replace placeholder “Clarity gives you the blocks…”).
- Right: white form; primary CTA full-width soft rectangle.
- Links: `accent.primary`, not raw `blue-600` / `teal-600`.

---

## 8. Voice and formatting

### Voice

- Sentence case for all UI text.
- Active verbs on buttons: “Approve”, “Reject”, “Save changes”, “Export CSV”.
- Same action, same label through a flow.
- No hype, no return promises.
- Errors: what happened + next step.

### Currency and numbers

- Symbol: **GH₵** (U+20B5).
- Display amounts: space after symbol — `GH₵ 48,720`.
- Inline compact (tables if needed): same rule for consistency.
- Thousands: comma. Decimals: 2 for prices/cash; 0 for large round totals when appropriate.
- Gains: `+GH₵ 4,310 (+9.7%)` with green + triangle. Losses: `−GH₵ 2,000` with red + triangle.
- Never color alone.

### Dates

- Lists: `Aug 28, 2026`.
- Stamps: `As of Aug 28, 2026, 3:32 PM` (GMT / Ghana) when showing market-related times.
- Prefer shared helpers over one-off `date-fns` formatting per page.

### Compliance note (admin)

When admin UI surfaces retail balances or payouts, do not imply Yanci holds client funds. Prefer neutral labels (“Available to invest”, “Withdrawal request”) consistent with ITSP / brokerage partner wording used in the consumer app.

---

## 9. Motion

- Press feedback: **150 ms**.
- Panel / modal transitions: **250 ms**.
- Ease-out enter, ease-in exit.
- Respect `prefers-reduced-motion`: fades only, no scale-bounce on buttons.

---

## 10. Token → code map

| Concern | Primary files |
|---|---|
| Color & type scales | [`tailwind.config.js`](tailwind.config.js) |
| Font variable | [`src/globals.css`](src/globals.css), [`src/pages/_app.js`](src/pages/_app.js) |
| Shell / input / scrollbar chrome | [`src/styles/tailwindFiles.css`](src/styles/tailwindFiles.css) |
| Buttons | [`src/components/button/Button.jsx`](src/components/button/Button.jsx) |
| Sidebar / navbar | [`Sidebar.jsx`](src/components/sidebar/Sidebar.jsx), [`Navbar.jsx`](src/components/navbar/Navbar.jsx) |
| Layout background | [`layout.jsx`](src/components/layouts/layout.jsx) |
| Metrics | [`MetricsCard.jsx`](src/components/metricsCard/MetricsCard.jsx) |
| Tables | [`src/components/table/`](src/components/table/) |
| Status colors in configs | [`src/config/tableConfig.js`](src/config/tableConfig.js), [`src/utils/seed.js`](src/utils/seed.js) (`bg-green-500` / `red-500` / `yellow-400`), page-level badges |
| Icons (hardcoded teal) | [`public/icons/sidebar/`](public/icons/sidebar/), [`public/icons/misc/`](public/icons/misc/) |
| Login brand surface | [`src/pages/login/index.jsx`](src/pages/login/index.jsx) |
| Charts | Dashboard colors in [`src/pages/index.js`](src/pages/index.js) — align to `accent.primary` / `gain` |

### Implementation order (when building)

1. Update `tailwind.config.js` colors + add semantic keys (`gain`, `loss`, `warning`, `info`, `navy`) and optional CSS variables in `:root`.
2. Restyle `@layer components` in `tailwindFiles.css` (borders, sidebar, inputs, metrics).
3. Button radius / variants; Table header; MetricsCard case and currency.
4. Chase raw `gray-*` / `green-*` / `red-*` / `blue-*` and SVG hex.
5. Login copy + panel tokens.

---

## 11. Open decisions

1. Confirm final hex with eyedropper against brand source (all *(proposed)* values).
2. Stay Inter-only vs add Plus Jakarta Sans for large numerals (locked: Inter for admin v1).
3. Whether admin ever ships dark mode.
4. How aggressively to soften table header teal (`primary-2` bar) toward neutral `bg.surfaceMuted`.
5. Currency helper: migrate `isDollar` metrics to GH₵ vs keep USD where the API returns dollars.

---

## 12. Relationship to other docs

| Doc | Role |
|---|---|
| Mobile design spec (Flutter) | Full consumer product + brand source |
| This file | Admin brand foundations only |
| [`FRONTEND_PRODUCTION_HARDENING.md`](FRONTEND_PRODUCTION_HARDENING.md) | Security / reliability hardening (orthogonal; can ship independently) |

---

## 13. Decisions locked

| Topic | Decision |
|---|---|
| Currency display | `GH₵ 48,720` (space after symbol) |
| Typeface | Inter only for admin v1 |
| Button shape | Soft rectangle radius 14 (not pill) |
| Primary CTA teal | Mid scale ≈ `#028090` |
| Theme | Light only for v1 |
| Scope | Foundations + admin chrome components; no consumer IA |
