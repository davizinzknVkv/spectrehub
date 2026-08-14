# Plan: Discord Cloner Implementation & Visual Refinement

Implement the Discord Cloner tool to allow users to replicate server structures (roles, categories, channels) and unify call-to-action text across the landing page for consistent conversion.

## User Review Required

> [!IMPORTANT]
> The Discord Cloner requires a Discord Token with "Manage Server" permissions on both the source and destination guilds. It does not copy messages or members due to API limitations.

## Proposed Changes

### Discord Cloner Tool
- Created `src/lib/cloner.functions.ts` with server-side logic to:
    - Fetch roles from the origin server and recreate them in the destination, mapping IDs.
    - Fetch categories and channels, recreating them while preserving hierarchy and permission overwrites (mapped to new roles).
    - Implement rate-limiting protection between API calls.
- Overhauled `src/routes/_app.clone.tsx`:
    - Replaced "Coming Soon" placeholder with a functional interface.
    - Added inputs for Origin and Destination Guild IDs.
    - Integrated `cloneServer` function with real-time feedback and status monitoring.

### Visual Refinement & Branding
- Standardized all primary action buttons on the home page to "Quero Usar o Spectre".
- Updated `SiteHeader.tsx`, `Hero.tsx` (implicitly), `FinalCta.tsx`, `FreeSignup.tsx`, and `CommunitySection.tsx`.
- Ensured all "Discord" or "Ticket" generic terms are replaced with the new brand-aligned CTA.

## Technical Details
- **Role Mapping**: Recreates permissions and colors. Managed roles (bots) and @everyone are skipped.
- **Hierarchy Preservation**: Categories are created first, and their new IDs are used as `parent_id` for text/voice channels.
- **Permission Overwrites**: Role-based overwrites are translated to the new role IDs created in the destination.
- **API Stability**: Uses the established `discordProxy` to ensure all requests carry the necessary Discord headers and pass through the application's rate limiter.
