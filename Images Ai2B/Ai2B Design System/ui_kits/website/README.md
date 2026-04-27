# Ai2B Website · UI kit

Single-file HTML recreation of the Ai2B landing page sections. Uses `colors_and_type.css` from the project root and pulls Lucide icons from CDN.

## Structure

- `index.html` — click-thru recreation: Nav → Hero → ScrollExperience (static 4-up, since pinned scroll requires GSAP + Lenis) → HowItWorks → Industries → WhyAi2B → Contact → Footer.
- Components live inline in `index.html` for portability. For a componentized version, read `Ai2B/src/components/*` directly — those are the source of truth.

## Notes

- The live hero uses a **WebGL fragment shader** (Simplex noise mesh-gradient). The kit approximates it with layered CSS radial-gradients + SVG grain. For production, import `Ai2B/src/components/HeroVisual.tsx`.
- The live ScrollExperience uses GSAP ScrollTrigger + Lenis for pinned horizontal scroll. The kit renders the 4 agent panels stacked vertically (same visual language, no motion dependency).
- Framer Motion entrance animations are replaced with CSS `@keyframes fade-up` for portability.
