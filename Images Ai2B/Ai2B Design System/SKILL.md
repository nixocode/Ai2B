---
name: ai2b-design
description: Use this skill to generate well-branded interfaces and assets for Ai2B (a Barcelona studio building custom AI agent systems), either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and a UI kit of React-ish components.
user-invocable: true
---

Read `README.md` in this skill first, then explore the other available files:

- `colors_and_type.css` — CSS custom properties + semantic typography classes. Always start here when producing HTML artifacts.
- `assets/` — logos, grain overlay (`noise.svg`), Lucide icon SVGs.
- `preview/` — tokenized examples of every piece of the system (colors, type, shadows, radii, components, motion, voice).
- `ui_kits/website/` — JSX-ish components and an `index.html` click-thru that recreates the live marketing site.

**If creating visual artifacts** (slides, mocks, throwaway prototypes, etc.) copy the assets you need out and import `colors_and_type.css` directly. Match the voice rules in the README's "Content fundamentals" section — engineering studio, not agency.

**If working on production code**, the repo is Next.js 16 + Tailwind v4 + Framer Motion + GSAP ScrollTrigger + Lenis. The real tokens live in `src/app/globals.css`; this folder mirrors them so you can design off-repo.

**Hard rules — do not break:**
- Dark theme only. No white mode.
- One accent (`#FF5A1F`). Per-agent hues stay inside their agent card.
- No emoji, no exclamation marks, no marketing vocabulary ("unlock", "empower", "leverage", "solutions").
- No stock imagery, no 3D spheres, no glassmorphism-for-its-sake, no gradient text, no marquee logos.
- Motion honors `prefers-reduced-motion`. AA contrast minimum.
- Mobile (≤640px) must work. Cut features before shipping a broken mobile version.

If the user invokes this skill without specific guidance, ask what they want to build, get 1–2 clarifying details, then act as an expert Ai2B-brand designer producing HTML artifacts or production code as needed.
