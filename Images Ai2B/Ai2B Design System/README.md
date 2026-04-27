# Ai2B Design System

A small Barcelona studio that builds **custom AI agent systems** for 20–500-person companies. Not chatbots. Not SaaS wrappers. End-to-end delivery in 4–6 weeks.

This design system captures the visual, typographic, and motion language of the Ai2B landing page, so new sections, assets, and sibling surfaces stay on-tone.

## Sources

- **Codebase** — `Ai2B/` (Next.js 16, Tailwind v4, Framer Motion, GSAP ScrollTrigger, Lenis, single WebGL fragment-shader hero).
- Key files read: `src/app/globals.css`, `src/app/layout.tsx`, `src/components/Hero.tsx`, `src/components/HeroVisual.tsx`, `src/components/Nav.tsx`, `src/components/HowItWorks.tsx`, `src/components/Industries.tsx`, `src/components/WhyAi2B.tsx`, `src/components/Contact.tsx`, `src/components/ScrollExperience.tsx`, `src/components/agents/*`, `src/lib/agents.ts`, `src/lib/segments.ts`.

## Product

Single marketing site (`ai2b.io`). Dark-only. Structure:

```
Nav → Hero (WebGL mesh-gradient) → ScrollExperience (pinned horizontal,
4 agents: Sales · Support · Ops · Research, each with its own mini-UI
animation) → HowItWorks (3 steps) → Industries (pill row) → WhyAi2B
→ Contact → Footer
```

The **four agents** are the product metaphor — each has its own mini-UI visual (chat thread, ticket queue, rota grid, document scanner) inside an `AgentFrame` with a chrome-header bar. Each agent owns a secondary hue used **only inside its card**.

## Content fundamentals

**Voice: engineering studio, not agency.** Confident, spare, technical, a little dry. The client is the subject; Ai2B is the operator.

- **Person.** Second person to the reader ("your workflows", "your stack", "your team"). First-person plural for Ai2B itself ("we design and ship"). Never "I".
- **Casing.** Sentence case everywhere. Headings, labels, buttons. Never title case. Mono eyebrows are ALL-CAPS but that's letter-form, not content style.
- **Length.** Short. Fragments are fine. Two-beat sentences preferred. "Three steps. Zero fluff." — that rhythm.
- **Numbers.** Concrete, always. "2 wks", "4–6 wks", "100%", "1,200 new leads / month", "24 hours". Round numbers feel marketing-y; real numbers feel like an operator wrote them.
- **Contractions.** Use them ("don't", "we'll", "it's"). Drops the formality.
- **Em dashes & ellipses.** Used liberally to break rhythm: "One agent. One GPU. One coffee." · "Working prototype in 2 weeks. Production in 4–6."
- **Tech vocabulary is welcome.** "On-prem", "no egress", "local LLMs", "your stack", "tok/s", "handover". Audience is founders + ops leaders who respect being talked to like adults.
- **No emoji. No exclamation marks.** Not in copy, not in UI.
- **No hedge words.** "Might", "could", "hopefully", "powerful solutions" — cut.
- **Anti-vocabulary.** "Synergy", "leverage", "unlock", "harness", "revolutionary", "game-changing", "AI-powered" (as adjective), "solutions", "ecosystem".

Examples pulled from the live site:
- H1: "Custom AI software, built for how your business actually works."
- Sub: "We design and ship AI systems tailored to your workflows and data — no templates, no off-the-shelf wrappers, no vendor lock-in."
- Step: "Diagnose — We map your workflows, bottlenecks and data — then pinpoint exactly where AI adds measurable value."
- Agent role: "Reads the pipeline. Writes the follow-ups."
- Agent bullet: "Runs overnight on-prem. No cloud. No leaks."
- CTA: "Book a call", "See how it works", "Let's build it"
- Footer: "© 2026 · Barcelona · hello@ai2b.io"

## Visual foundations

- **Theme.** Dark-only. No white mode. Everything sits on `#0A0A0F`.
- **Palette.** One accent (`#FF5A1F` orange). Per-agent hues (`#FF5A1F`, `#E85D75`, `#FFB84D`, `#6EA8FE`) appear **only inside their own agent card** — chat bubble tint, pipeline bar, header dot, ambient halo. Never bleed out to the page.
- **Neutrals.** `--bg`, `--surface` (#111117), `--surface2` (#16161E), `--border` (#242430), `--border-2` (#2F2F3D). Five steps is enough.
- **Foreground.** `#F5F5F7` primary, `#A8A8B4` muted, `#6E6E7C` subtle. High contrast, AA minimum.
- **Typography.** Geist (display + body) and Geist Mono (labels, code). Headings: `font-weight: 600`, `line-height: 1.05`, `letter-spacing: -0.035em`. Heading-tight (sub-section, card titles): 500 / 1.15 / -0.022em. Body: letter-spacing -0.011em. Mono eyebrows: 0.72rem, 500, UPPERCASE, tracking 0.16em.
- **Backgrounds.** The hero runs a single **WebGL fragment-shader mesh-gradient** (Simplex noise, accent + deep violet, mouse-parallax). Everything else is flat. A fixed grain overlay (`noise.svg`, opacity 0.025, `mix-blend-mode: overlay`) sits above all content for tooth. No repeating patterns, no photography, no illustration.
- **Cards.** 1px `--border`, `--radius-lg` (14px), `var(--surface)` fill, inner 1.5rem padding. Hover: `--border-2` + lift to `--surface2`. A subtle top-edge gradient accent (`linear-gradient(90deg, transparent, {color}80, transparent)` at 1px height) is used on `AgentFrame` only.
- **Shadows.** Mostly inset + soft drop: `0 20px 60px -30px rgba(0,0,0,0.70)` on agent frames. CTAs: inset highlight + accent glow (`0 6px 18px -6px var(--accent-glow)`). No Material-style elevation ramp.
- **Radii.** 10px buttons, 14px cards, 16–24px inner chips, `999px` pills (nav, industry tags, accent dot).
- **Borders.** Always 1px. A hairline rule uses a gradient (`linear-gradient(90deg, transparent, var(--border-2), transparent)`) — never solid full-width. This is a recurring motif: fades in from the edges.
- **Transparency + blur.** Used **sparingly**, only for floating chrome: nav shell (`rgba(14,14,19,0.55)` + `blur(14px)`), glass pill badges (`rgba(17,17,23,0.55)` + `blur(12px)`), hover popovers. Never as decoration.
- **Dot grid.** On hero only, `radial-gradient(rgba(245,245,247,0.7) 1px, transparent 1px)` at 28×28, 6% opacity, masked to an ellipse at the center. Low-frequency texture, not a wallpaper.
- **Layout.** `max-width: 1240px` centered, 1.5rem gutter mobile, 2.5rem ≥768. Section padding `6rem 1.5rem` mobile, `8rem 2.5rem` desktop. 12-col grid for split sections. Sticky-column pattern on `WhyAi2B`.
- **Motion.** Primary easing `cubic-bezier(0.22, 1, 0.36, 1)` ("ease-out"). Secondary `cubic-bezier(0.65, 0, 0.35, 1)`. Durations cluster at 180ms (hover), 240ms (state), 350ms (reveal), 700ms (hero stagger). Enter-from: `y: 20–28px → 0`, `opacity: 0 → 1`. Staggered children at 80ms step. Page-level smooth scroll via Lenis. Pinned horizontal scroll for the agent track (GSAP ScrollTrigger). Nothing bounces, rotates, or pulses except: a 2.2s pulse-ring on the hero status dot, a 2s bounce on the scroll-down arrow, and a 40s slow-spin reserved for orbital motifs.
- **Hover.** Cards: border goes `--border` → `--border-2`, bg `--surface` → `--surface2`. Links: `color: muted → text`. CTAs: bg `--accent` → `--accent-soft`, translateY(-1px), deeper glow.
- **Press.** CTAs: `translateY(0)`. No color shift. No shrink.
- **Focus.** Keyboard focus on inputs pushes `border-color` to `--accent`. No outline ring (focus-visible could be added — noted as gap).
- **Iconography.** `lucide-react`, stroke-based, 1.5–1.6 stroke weight, 14–20px sizes. Always on a 40–44px rounded chip (`rounded-xl`) with a tinted wash background + 1px tinted border. Never standalone on flat bg.
- **Imagery.** None. No stock photography, no illustrated people, no 3D. The WebGL hero is the only decorative visual.
- **Protection gradients.** Used on horizontally-scrolling pill row (Industries): 64px-wide gradient from `--bg` to transparent on each edge, z-index above the scroller.
- **Number/stat treatment.** Giant numbers use `heading-tight` weight 500 at 44px+ in `--accent` (HowItWorks step numbers) or `--text` (Hero 2 wks / 4–6 wks / 100% row), paired with mono eyebrow below.

## Iconography

Stack: **`lucide-react`** (installed in `package.json`). Stroke-based, 1.5–1.6 weight.

Usage pattern (verbatim from `HowItWorks.tsx`):
```
<span className="w-10 h-10 rounded-xl flex items-center justify-center"
      style={{ background: "var(--accent-wash)",
               border: "1px solid rgba(255, 90, 31, 0.2)" }}>
  <Icon size={18} strokeWidth={1.6} style={{ color: "var(--accent)" }} />
</span>
```

Where a per-agent color is in scope, the chip uses `{color}14` bg + `{color}40` border and matching icon fill.

Icons actually used in the product: `ArrowUpRight`, `ArrowDown`, `Microscope`, `Hammer`, `Rocket`, `Headphones`, `LifeBuoy`, `CalendarClock`, `FileSearch`, `UtensilsCrossed`, `ShoppingBag`, `Scale`, `Megaphone`, `Fingerprint`, `Languages`, `Zap`, `KeyRound`, `CheckCircle2`, `Loader2`.

For HTML mocks in this design system, Lucide ships CDN SVGs at `https://unpkg.com/lucide-static@latest/icons/<name>.svg`. The UI kit uses this form.

**No emoji** anywhere. **No unicode glyph icons** except the bullet (`·`) as a separator in copy ("Barcelona · working EU-wide"). Logo is a gradient-filled circle with a 4px hole, CSS-only (see `.nav-logo-mark` in `globals.css`).

## Font substitution

The source uses **Geist** + **Geist Mono** via `next/font/google`. No self-hosted files in the repo. Design-system cards and UI kit load Geist from Google Fonts CDN. **If you need the authoritative files, grab them from the Vercel font repo or let me know and I'll wire self-hosted .woff2.**

## Index

- `README.md` — this file.
- `colors_and_type.css` — CSS custom properties + semantic type classes. Paste into any HTML to get the house style.
- `SKILL.md` — agent-skills-compatible entry point. Tells a downstream agent how to use this folder.
- `assets/` — logos, icons, and the grain overlay. `noise.svg` is the fixed grain texture used by `.grain-overlay`. `logo-mark.svg` reproduces the nav mark (CSS-original). `icons/` holds Lucide SVGs lifted from the CDN for the 20 icons the product uses.
- `preview/` — individual HTML cards for the Design System tab (colors, type, components, motion, voice).
- `ui_kits/website/` — HTML + JSX recreation of the live site sections (nav, hero, agent card, how-it-works, industries, why, contact, footer). `index.html` is an end-to-end click-thru.

## Caveats

- Font files are **not** bundled — served via Google Fonts CDN. Ask if you need self-hosted.
- The live WebGL hero shader is reproduced as a **CSS mesh-gradient approximation** in the UI kit. The original is `HeroVisual.tsx`; copy that file for the real shader.
- No Figma was provided, so the UI kit is read directly from the codebase.
