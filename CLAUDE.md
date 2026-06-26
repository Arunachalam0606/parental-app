# CLAUDE.md - Developer Information & System State

This file contains operational details, guidelines, and context configurations for working on this project.

## Design Context

### Users
- **Target Audience:** Multi-generational users. Includes parents managing screen time restrictions remotely and monitoring children, children/teens interacting with time allowance notifications and locked applications, and individual adults tracking personal productivity.
- **Context of Use:** Used throughout the day (often in low-light environments like bedrooms or during transit). User experience must be calming, readable, and non-straining to the eyes in both light and dark modes.
- **Job to Be Done:** Set daily limits on app categories, monitor usage breakdowns, configure block rules, track daily/weekly active status, and toggle/configure adblocker rules to minimize distractions.

### Brand Personality
- **Voice & Tone:** Calm, reassuring, premium, and friendly.
- **3-Word Personality:** Soft, Fluid, Elegant.
- **Emotional Goals:** Evoke a sense of peace and healthy control rather than restrictive anxiety.

### Aesthetic Direction
- **Visual Tone:** Minimalist weightless interface (Antigravity), soft curved profiles (Samsung One UI 8.5 Digital Wellbeing inspired), desaturated eye-friendly pastels, and glassmorphism cards.
- **References:** Samsung One UI 8.5 Digital Wellbeing (for rich analytics, notifications chart, top categories, app stats) and modern iOS settings.
- **Anti-References:** Strict neobrutalism (no heavy black borders, no raw primary colors, no jagged styling), sharp edges, and clutter.
- **Theme:** Adaptive Light & Dark mode. Light mode utilizes low-contrast cream/slate tones to avoid glare.

### Design Principles
1. **Ergonomic Touch Targets:** Minimum 44x44px clickable areas positioned within the natural thumb zone of the mobile viewport.
2. **Radial Telemetry Over Linear Bars:** Daily and hourly limits represented via concentric rings, activity bubbles, and soft progress arcs.
3. **Weightless Depth (Antigravity):** Elements layer using desaturated backgrounds, frosted-glass filters, and soft, diffused drop shadows.
4. **Delightful Micro-interactions:** Smooth spring animation feedback on toggles, profile switching, and chart bar hover elements.
