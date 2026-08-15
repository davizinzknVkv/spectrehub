# Responsive & Performance Refactor Plan

Refactor Spectre Hub to be 100% responsive (mobile-first), ergonomic, and high-performance following elite design standards.

## 1. Mobile-First Fluid Architecture
- **Global CSS**: Update `src/styles.css` with fluid typography and spacing tokens using `clamp()`.
- **Layouts**: Replace fixed widths and absolute positioning that break on small screens with CSS Grid and Flexbox.
- **Root Shell**: Ensure the viewport is correctly managed and `overflow-x-hidden` is strictly enforced.

## 2. Component Refactoring
- **Hero Section**: 
  - Make the "spectre-arrow" SVG responsive (scale down on mobile).
  - Use `clamp()` for the large industrial headings.
  - Optimize the logo pulse animation for lower CPU usage.
- **Products Section**:
  - Ensure the gallery/preview container uses `aspect-ratio` to prevent CLS.
  - Optimize tab buttons for touch interactions (min 44px).
  - Improve readability of descriptions on small screens.
- **Plans Section**:
  - Adjust the grid strategy to stack elegantly on mobile/tablets.
  - Enhance visual hierarchy of pricing tiers.
- **Community Section**:
  - Scale the Discord widget container proportionally.
  - Optimize the marquee animation to prevent layout thrashing and ensure zero horizontal overflow.

## 3. Ergonomics & Touch
- **Navigation**: 
  - Overhaul the mobile menu into a more ergonomic "bottom sheet" style or a high-impact full-screen overlay.
  - Increase hit areas for social links and language selectors.
- **Interactions**: Remove hover effects on touch devices to prevent "sticky" states.

## 4. Performance Optimization
- **Asset Loading**: Add `loading="lazy"` to non-critical images.
- **Animations**: Use `will-change` where appropriate and ensure animations are `transform`/`opacity` based.
- **i18n**: Ensure the translation loading doesn't block the main thread.

## Technical Details
- Use `text-[clamp(min, preferred, max)]` for all major headings.
- Convert fixed `px` margins/paddings to relative `rem` or fluid `vw` units.
- Implement `@media (hover: hover)` for desktop-only effects.
- Ensure all clickable elements meet the 44x44px target.
