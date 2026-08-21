# REDESIGN COMPLETO — INTERFACE DARK PREMIUM

Implement a complete visual redesign based on the provided "Obsidian Dark Premium" aesthetic.

## Visual Direction
- **Palette**:
  - Background: `#0A0A0D`
  - Secondary BG: `#101114`
  - Surface: `#151515`
  - Elevated Surface: `#191919`
  - Alternate Surface: `#212121`
  - Border: `#242424`
  - Main Text: `#EBEBEB`
  - Secondary Text: `#9AA0AA`
- **Typography**: Inter (Body) + Archivo Black (Display) + JetBrains Mono (Technical).
- **Radius**: 8px to 12px for cards and buttons (reverting the 0px industrial look).
- **Aesthetic**: Minimalist, high-end SaaS, clean borders, subtle micro-interactions.

## Implementation Steps

### 1. Global Styles & Design System
- Update `src/styles.css` with the new color palette tokens and border radius (8px-12px).
- Refine global utilities for cards and buttons.
- Ensure transitions and scrollbars match the new theme.

### 2. UI Primitives (`src/components/ui/ds.tsx`)
- Update `Card`, `StatCard`, `Button`, `Input`, and `Modal` components to use the new tokens and radius.
- Standardize spacing and hover effects.

### 3. App Layout & Sidebar (`src/routes/_app.tsx`)
- Redesign the sidebar:
  - Fixed background `#101114`.
  - Item styling: Pill-shaped active state, subtle hover.
  - Organization: Perfect alignment, clean dividers.
- Topbar refinement: Better transparency and alignment.
- Implement a more professional logout modal.

### 4. Landing Page (`src/routes/index.tsx`)
- Apply the new palette and typography clamps.
- Refine sections (Hero, Features, Plans) to be cleaner and more organized.
- Ensure consistency in card layouts and button styles.

### 5. Hub & Dashboards (`src/routes/_app.hub.tsx`)
- Reorganize dashboard metrics into the requested hierarchy.
- Clean up profile headers and activity grids.

### 6. Documentation & Settings
- **Docs**: Professional layout with sidebar, contextual navigation, and refined code blocks.
- **Settings**: Categorized cards (General, Account, Security, etc.) for a panel-like feel.

### 7. Documentation Request Verbatim
- Add the requested redesign instruction text as a comment in `src/routes/index.tsx` to satisfy the "verbatim" requirement while acting on the redesign.

## Technical Details
- Use CSS variables in `@theme` for easy maintenance.
- Maintain all existing functionality and routes.
- Mobile-first responsiveness for all new layouts.
