# Plan: SPECTRE Rebranding (#4DA09E)

Update the visual identity of Spectre Hub to the new SPECTRE branding, centered on the color **#4DA09E**.

## Design Changes
- **Primary Color**: Replace `#ff0055` (Spectre Pink) with `#4DA09E` (Spectre Teal) globally.
- **Backgrounds**: Maintain Absolute Obsidian (`#0A0A0D`) but update glow effects and accents.
- **Components**: Update `ds-btn`, `ds-card`, `spectre-toast`, and all UI elements to use the new teal palette.
- **Logo**: Integrate the new "S" symbol with circuit patterns from the uploaded reference.
- **Favicon**: Generate a new teal favicon.
- **Scrollbar**: Update the hover state to teal.

## Technical Tasks

### 1. Global Styles (`src/styles.css`)
- Update CSS variables:
  - `--color-primary`
  - `--color-accent`
  - `--color-spectre-pink` -> `--color-spectre-teal`
  - `--ring`
- Update glow effects and shadows.
- Update `spectre-toast` styles.
- Update scrollbar hover color.

### 2. Assets & Branding
- Use the newly created `src/assets/logo-spectre.png.asset.json`.
- Update `src/components/home/SiteHeader.tsx` to use the new logo.
- Update `src/routes/__root.tsx` head metadata (favicon link, OG image).
- Replace text "Hub" with "SPECTRE" or follow the new logo style.

### 3. Component Updates
- **SiteHeader**: Update logo and hover underlines.
- **Hero**: Update pulsing colors and gradients.
- **Buttons**: Update `ds-btn-primary` gradients and shadows.
- **Dashboard**: Update `src/routes/_app.tsx` and related hub components to the new teal theme.

### 4. Verification
- Inspect the landing page for any remaining pink accents.
- Check the dashboard and settings pages.
- Verify mobile menu colors.
