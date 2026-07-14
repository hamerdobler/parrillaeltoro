---
name: El Toro Ancestral
colors:
  surface: '#13140f'
  surface-dim: '#13140f'
  surface-bright: '#393a33'
  surface-container-lowest: '#0e0f0a'
  surface-container-low: '#1b1c17'
  surface-container: '#1f201a'
  surface-container-high: '#292a25'
  surface-container-highest: '#34352f'
  on-surface: '#e4e3d9'
  on-surface-variant: '#c4c7c7'
  inverse-surface: '#e4e3d9'
  inverse-on-surface: '#30312b'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c8c6c5'
  primary: '#c8c6c5'
  on-primary: '#313030'
  primary-container: '#1a1a1a'
  on-primary-container: '#848282'
  inverse-primary: '#5f5e5e'
  secondary: '#c6c7c2'
  on-secondary: '#2f312e'
  secondary-container: '#484a46'
  on-secondary-container: '#b8b9b4'
  tertiary: '#ffb59b'
  on-tertiary: '#5b1a00'
  tertiary-container: '#360c00'
  on-tertiary-container: '#d55f32'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e3e3de'
  secondary-fixed-dim: '#c6c7c2'
  on-secondary-fixed: '#1a1c19'
  on-secondary-fixed-variant: '#454744'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#812800'
  background: '#13140f'
  on-background: '#e4e3d9'
  surface-variant: '#34352f'
typography:
  display-lg:
    fontFamily: Bebas Neue
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: 0.05em
  display-lg-mobile:
    fontFamily: Bebas Neue
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
  headline-md:
    fontFamily: Bebas Neue
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '300'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.15em
---

## Brand & Style

The design system embodies the intersection of raw, ancestral Argentine fire-cooking and high-end modern minimalism. It targets a sophisticated culinary audience that values the juxtaposition of primitive elements (fire, iron, leather) with refined service. 

The visual style is **Minimalist-Rustic**. It uses "blackspace" to create a sense of focused luxury, allowing the vibrant colors of grilled meats and glowing embers to stand out. The emotional response should be one of quiet confidence, warmth, and artisanal precision. Every element feels intentional, echoing the patience required for the perfect *asado*.

## Colors

The palette is anchored in the "Soot and Bone" contrast, now punctuated by a vivid thermal accent.

- **Primary (#1A1A1A):** Deep Charcoal. Used for the primary background to simulate the infinite depth of a cooling grill or a night in the Pampas.
- **Secondary (#F5F5F0):** Off-White/Bone. Used for primary typography and high-contrast UI elements to ensure legibility against the dark void.
- **Accent (#F67848):** Burnt Orange/Ember. Used for calls to action, highlights, and status indicators, representing the intense heat of live coals (*brasas*).
- **Neutral (#8C8C84):** Ash Gray. Used for secondary text and subtle separation to ground the palette.

## Typography

This design system utilizes a high-impact typographic pairing to bridge the gap between the industrial and the modern.

- **Display & Headings (Bebas Neue):** A powerful, condensed Sans-Serif that evokes the look of vintage woodblock posters and industrial stamping. Its verticality suggests strength and tradition. Use generous letter-spacing to enhance the premium feel.
- **Body & UI (Hanken Grotesk):** A clean, sharp, contemporary Sans-Serif. The thin strokes and generous tracking in the "Light" weight maintain the minimalist aesthetic while ensuring high readability for ingredient lists and pricing.
- **Labels:** Always uppercase with significantly increased letter spacing to mimic the look of stamped leather or industrial iron marks.

## Layout & Spacing

The layout follows a **Fixed Grid** model on desktop to maintain a cinematic, centered focus. On mobile, it transitions to a fluid single-column layout with generous vertical "breathing room."

- **The Rule of 8:** All margins and paddings scale in increments of 8px.
- **Asymmetric Balance:** Use large, intentional gaps in content to draw the eye toward featured items (e.g., a single "Corte del Día" highlighted against a vast dark field).
- **Margins:** Large outer margins (64px+) on desktop reinforce the premium, "un-crowded" atmosphere of a high-end restaurant.

## Elevation & Depth

Depth is conveyed through **Tonal Layers** and subtle textures rather than traditional shadows. 

- **Surface Levels:** The base is #1A1A1A. Interactive sections use subtle tonal variations to create hierarchy without breaking the minimalist flat aesthetic.
- **Glassmorphism:** Use a very subtle backdrop blur (8px) with a 5% opacity Bone (#F5F5F0) overlay for sticky navigation bars to simulate a light haze or smoke.
- **Texture Overlays:** Apply a low-opacity (2-3%) "noise" or "brushed metal" SVG filter to the primary background to provide the tactile, rustic feeling of iron.

## Shapes

The design system utilizes **Sharp (0px)** corners for all primary UI elements. 

- **Rationale:** Straight lines and 90-degree angles evoke the precision of a chef's knife and the architectural ironwork of a traditional Argentine *parrilla*.
- **Exceptions:** Photography of food should remain naturalistic, but framed within sharp-edged containers.
- **Dividers:** Use ultra-thin (0.5pt) Bone-colored lines to separate menu sections, reminiscent of blueprint or technical drawings.

## Components

- **Buttons:** Rectangular, sharp-edged. Primary buttons use a Burnt Orange (#F67848) background with Charcoal text. Secondary buttons use a fine-line Bone border (1px) with no fill.
- **Chips / Tags:** Small, uppercase text framed by a Burnt Orange (#F67848) left-side border only. Used for "Recomendado" or "Kilo" markers.
- **Lists (The Menu):** Simple vertical stacks. Item name on the left in Bebas Neue, price on the right in Hanken Grotesk. Use a dotted leader line only if the gap exceeds 400px.
- **Input Fields:** A single bottom border in Bone. Labels float above in `label-sm` style. No background fill.
- **Cards:** No border, no shadow. Separation is achieved through subtle tonal shifts or 1px Bone-colored outlines.
- **Iconography:** Custom icons must be "Stroke" based (1px thickness), depicting elements like fire, knives, and wine glasses in a simplified, geometric manner.