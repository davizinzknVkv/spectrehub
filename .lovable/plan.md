# Plan: Hub Restoration and Enhancement

Restoring the detailed dashboard sections (Profile Header, Statistics Grid, Security Details, Guild Management) while maintaining the new Obsidian Industrial aesthetic.

## User Experience
- Rich profile header with Discord badges and detailed server/friend/DM counts.
- Detailed account security grid (Email, Phone, 2FA, Created At).
- Bio and Quest progress visualization.
- "Manage Servers" section with list and bulk-exit options.
- Maintain the Spectre Pink (#ff0055) accents and clipped-corner buttons.

## Technical Details
- **Data Fetching**: Parallelize calls to `fetchUserInfoDetailed`, `fetchRelationshipsCount`, `fetchDMsCount`, `fetchGuilds`, `fetchProfileBio`, and `fetchProfileBadges` in `src/routes/_app.hub.tsx`.
- **Layout**: 
    - Top Section: Hero-style profile header with large username and stat badges.
    - Grid Section: "Ações Rápidas" (existing) + "User Info Premium" (restored).
    - Bottom Section: Guild list management.
- **Components**: Reuse `StatCard`, `Badge`, and `Button` from `src/components/ui/ds.tsx`.
- **States**: Implement robust loading skeletons for each data block.

## Design Changes
- Typography: Archivo Black for headers, Inter Tight for body.
- Borders: 0px radius, white/5 borders.
- Effects: Glassmorphism and subtle pink glows for active states.
- Actions: Restore "Listar Servidores" and "Sair de Todos" buttons.

## Verification
- Confirm all Discord data (bio, badges, counts) displays correctly.
- Verify "Ações Rápidas" cards link to their respective routes.
- Ensure loading states don't cause layout shift.
- Test "Sair de Todos" modal and action.
