# Plan: Elite Performance & Security Consolidation

Finalize the staff-level security audit and optimize the Obsidian Industrial interface for maximum performance and stability.

## Security Hardening
- **discord_accounts RLS**: Confirm `last_orbs` and sync metadata are visible to owners, but sensitive proxy material is restricted.
- **CSRF & Session Security**: Inject standard security headers (CSP, Frame-Options, Content-Type-Options) into the root route head.
- **Admin Access**: Consolidate the `is_site_admin` check to use the hardened `site_admins` table instead of trusting user-writable Discord data.
- **Rate Limit Sweep**: Add a targeted garbage collection loop to `src/lib/rate-limit.server.ts` to prevent memory exhaustion in high-traffic edge environments.

## Performance Optimization
- **Data Preloading**: Update `src/router.tsx` to use `defaultPreload: "intent"` for instant navigation.
- **SSR Hydration Fixes**: Ensure `useCountUp` and other visual counters are SSR-safe to prevent hydration mismatches.
- **Resource Priority**: Set `fetchPriority: "high"` for the logo and LCP assets in `src/routes/index.tsx`.
- **Marquee Stabilization**: Throttle Discord widget fetches to prevent UI layout shifts during slow network responses.

## UI/UX Refinement
- **Design System Consistency**: Enforce the hexagonal `ds-btn` clip-path and Absolute Obsidian (#030303) palette across all new modules.
- **Responsive Audit**: Fix potential horizontal overflow on mobile for the `10rem` hero typography.
- **Admin Terminal**: Update `_app.admin.tsx` to reflect the latest plan IDs and daily mission limits (20 for Free).

## Technical Details
- **Rate Limit**: Hardened sliding window implementation with IP header validation for Cloudflare.
- **CSP**: `default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; connect-src 'self' https://discord.com;`.
- **Supabase**: Use `public.has_role()` pattern (security definer) for any role-based table access if applicable.
