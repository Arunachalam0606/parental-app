# Wellbeing App Redesign Specifications (One UI 8.5 Modernization)

Use these specifications to guide the design system overhaul and component redesign of the Wellbeing Dashboard and Child Space POC.

---

## 1. Core Codebase & Layout Preservation (CRITICAL)
- **Do NOT delete, hide, or simplify existing screens, sub-pages, or graphs.**
- Keep all of the following core data displays exactly as they are configured (do not convert them to generic tabs or strip detail):
  - **Screen Time Donut Chart:** Multi-segment circular representation of top apps.
  - **Weekly Report Stacked Bars:** Day-by-day vertical bars showing usage.
  - **Heatmap Grid:** Hourly 7x24 density layout representing device pickups.
  - **Goal Semicircular Gauge:** Half-ring arc representation of remaining goal minutes.
- The overall page flow, routes, and layout structures must remain identical to the original implementation.

---

## 2. Global Styling & Design Language Redesign
- **Light Mode Colors:** Use soft, warm sand/ivory pastel tones (`oklch(0.978 0.005 85)` for background, `oklch(0.99 0.003 85 / 80%)` for frosted card overlays) instead of harsh bright white.
- **Card Spacings & Margins:** Standardize card padding to `p-4.5` and gaps to `gap-3.5` or `gap-4` to prevent elements from feeling cluttered or clipped.
- **Card Radii:** Standardize container borders to `rounded-2xl`. Do not use over-rounded corners (like `rounded-3xl` or `rounded-[38px]`) for inner elements as it clips content against the mobile viewport framing.

---

## 3. App Allowance Segmented Indicators
- **No Linear Progress Lines:** Remove all straight linear progress indicator bars from the app.
- **Segmented Block Indicator:** Replace all linear progress indicators with a **4-segment rounded pill block element** (styled like a clean battery charge or power gauge indicator). 
  - Fill segments incrementally according to usage percentage (e.g. `0%` is 0/4 filled, `25%` is 1/4 filled, etc.).
  - Color segments in soft theme/brand colors when active, and set to muted secondary backgrounds when empty.

---

## 4. Touch-First Mobile Interactions (No Hover States)
- **Remove all hover states:** Mobile screens do not support hover effects. Do not use hover scaling (`hover:scale-...`) or hover background color shifts.
- **Add active touch feedback:** Use responsive active touch feedback scale states (e.g., `active:scale-[0.98]` or `active:scale-95` with transition-all) for cards, buttons, and triggers.

---

## 5. Child Mode Space Redesign
- **Redesign the entire child screen** to feel custom-designed, friendly, and premium.
- **Personalized Child Gradients:** Dynamically switch the child space gradient backdrop based on the active child profile:
  - **Lily:** Cozy warm evening sunset theme featuring soft peach, coral, and rose-gold gradients.
  - **Alex:** Peaceful morning sky theme using lavender, indigo, and soft sky-blue gradients.
- **Tacit App allowance Cards:** Styled app blocks with custom soft light pastel gradients (YouTube: soft rose-red, Instagram: soft pink-purple, Minecraft: soft emerald-green, TikTok: soft sky-blue) and 4-segment visual fuel blocks.
- **Approved Websites:** Render whitelisted links as soft teal-mint pastel grid cards with glowing circular globe badges.
- **Glassmorphic Lock Overlay:** When an app is locked, render a frosted translucent backdrop (`backdrop-blur-xl bg-slate-950/90`) accented by glowing, floating decorative play spheres behind the parent PIN bypass options.

---

## 6. Parent Wellbeing Dashboard Updates
- **Remove Habits Card:** Delete the "Build healthy digital habits" banner card completely from the main wellbeing home dashboard view.
- **Demo Toggle Support:** Ensure both Parent Dashboard and Child Space support a "Demo: Empty" toggle switch to easily showcase empty states for testing zero-state feeds.
