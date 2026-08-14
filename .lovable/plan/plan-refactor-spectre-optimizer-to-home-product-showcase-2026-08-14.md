# Plan: Refactor Spectre Optimizer to Home Product Showcase

The Spectre Optimizer will be transformed from a functional dashboard module into a premium product showcase on the landing page, fully manageable via the Admin Panel.

## User Review Required

> [!IMPORTANT]
> The existing functional Spectre Optimizer dashboard and its sidebar link will be removed as requested.

## Proposed Changes

### Database & Backend
- Create new tables for Optimizer management:
  - `optimizer_settings`: Core info (title, subtitle, description, button text, status badge).
  - `optimizer_features`: List of feature cards (icon, title, description, order).
  - `optimizer_previews`: Showcase images (image, title, description, order).
- Add RLS policies and grants for these tables (public read, admin write).
- Update `src/lib/admin.functions.ts` to include server functions for managing these new tables.

### Admin Panel
- Add a new "Optimizer" tab to `src/routes/_app.admin.tsx`.
- Implement forms to edit main settings, manage features, and upload/manage preview images.

### Home Page
- Remove the "Spectre Optimizer" functional route and its logic.
- Add a new "Spectre Optimizer" section to `src/routes/index.tsx` between existing sections and the footer.
- Implement responsive grid layouts for features and a gallery for previews.
- Connect this section to live data from the new database tables.

### Cleanup
- Remove `src/routes/_app.optimizer.tsx`.
- Remove the "Sistema" group and its "Spectre Optimizer" link from `src/routes/_app.tsx`.
- (Optional) Keep `src/lib/optimizer/` folder if types are reusable, otherwise delete.

## Technical Details
- **Schema Migration**:
  ```sql
  CREATE TABLE public.optimizer_settings (...);
  CREATE TABLE public.optimizer_features (...);
  CREATE TABLE public.optimizer_previews (...);
  ```
- **Icons**: Use Lucide icons for features, manageable via a key string in the database.
- **Status Badges**: Support "Em breve", "Disponível", etc., with distinctive styling.
