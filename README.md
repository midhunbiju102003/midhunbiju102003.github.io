# Midhun Biju — Developer Portfolio

> Constellation floating on black velvet.

A responsive, high-aesthetic personal portfolio built with pure HTML, CSS, and modern JavaScript. Inspired by the Dala dark-stage design environment where deep black voids meet an interactive neural particle constellation, monolithic weight-400 typography, ultra-light reading copy, and Electric Iris violet accents.

No build step, package manager, or server runtime required.

---

## Design System & Principles

- **Surfaces:** Pure black void (`#000000`) throughout canvas and sections. Elements float on black with whitespace alone — no panels, cards, shadows, or background boxes.
- **Color Hierarchy:**
  - **Void (`#000000`):** Negative space canvas allowing chromatic accents to float.
  - **Bone White (`#ffffff`):** Headlines and primary typography.
  - **Electric Iris (`#8052ff`):** Single saturated violet reserved exclusively for primary action pills and brand accents.
  - **Saffron Spark (`#ffb829`):** Accent links, small uppercase labels, and attention punctuation.
  - **Deep Verdant (`#15846e`):** Secondary logo gradient stop and subtle particle accent.
  - **Ash Gray (`#9a9a9a`) & Silver Mist (`#bdbdbd`):** Secondary and tertiary text.
- **Typography:**
  - Single typeface family: `Inter` with OpenType `ss01` alternate glyphs.
  - **Headlines:** Display sizes (78–113px) set at **weight 400** with negative tracking (`-0.04em`), trusting scale rather than bold weight for hierarchy.
  - **Body Copy:** Set at **weight 200 (ultra-light)** at 18px (`line-height: 1.5–1.6`) for an airy, weightless reading experience.
  - **Labels & CTAs:** Weight 600 at 14px with `0.025em` tracking.
- **Signature Visual:**
  - Real-time HTML5 Canvas rendering a 3D organic neural brain constellation composed of tiny, sharp-edged outlined multicolored triangular particles (Electric Iris, Saffron Spark, Deep Verdant, Magenta, Sky Blue).
  - Ambient floating triangle field drifting across the void at subtle opacity.
  - Full mouse tracking and interaction.
  - Seamless reduced-motion fallback (`prefers-reduced-motion: reduce`).

---

## Included Sections

1. **Navigation:** Minimalist top bar with stylized geometric brand mark, uppercase section links, and mobile drawer.
2. **Hero:** Asymmetric two-column split — oversized left-aligned display headline and ultra-light copy paired with the interactive 3D particle brain constellation.
3. **01 / About:** MCA foundation, problem-solving approach, and three core development tenets.
4. **02 / Selected Work:** Spacious project entries with category filter toggles (`All`, `Web Apps`, `Research`).
5. **03 / Toolkit:** Categorized capabilities across backend engineering, frontend architecture, data systems, and developer workflow.
6. **04 / Background:** Academic timeline (MCA & BCA) and verified certifications.
7. **05 / Get In Touch:** Two-column contact section featuring the single Electric Iris violet pill button, social links, and current availability status.
8. **Footer:** Minimal copyright line with back-to-top anchor.

---

## Run Locally

1. Open `index.html` directly in any modern web browser, or use the **Live Server** extension in Visual Studio Code.
2. Edit content in `index.html`, tokens in `styles.css`, or particle parameters in `script.js`.

---

## Publish with GitHub Pages

1. Create a public repository named `midhunbiju102003.github.io` on GitHub.
2. Push `index.html`, `styles.css`, `script.js`, and `README.md` to the `main` branch.
3. In GitHub, go to **Settings → Pages**.
4. Select **Deploy from a branch**, choose `main` and `/(root)`, then save.
5. Your portfolio will be live at `https://midhunbiju102003.github.io`.

---

## Motion & UX Layer

Scroll-progress bar, blurred sticky header, word-by-word headline reveal, staggered scroll reveals, tech marquee, inline SVG project art, animated project filter, magnetic buttons, drag/touch/click-pulse on the constellation, keyboard skip link and focus rings. All motion is disabled under `prefers-reduced-motion`.
