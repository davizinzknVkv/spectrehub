# Security Hardening Plan - Spectre Hub

This plan outlines the steps to perform a comprehensive security audit and implementation to protect the Spectre Hub platform against common vulnerabilities and ensure it is production-ready.

## 1. Frontend Security & CSP Hardening
- **Harden Content Security Policy (CSP)**: Restrict `script-src`, `connect-src`, `frame-src`, and `img-src` to known safe domains.
- **Remove unsafe-eval**: Audit and remove dependencies or patterns requiring `unsafe-eval`.
- **Implement Security Headers**: Add `X-Frame-Options`, `Permissions-Policy`, and strictly configure `Referrer-Policy`.

## 2. API & Server Function Hardening
- **Secure Public Endpoints**:
    - Protect `/api/public/audit` with an API key or internal-only check.
    - Harden `/api/public/discord-image` with stricter URL validation to prevent SSRF and open redirect.
- **Proxy Validation**: Add an allowed-list of Discord API endpoints to `discordProxy` to prevent arbitrary API abuse via the frontend.
- **Input Sanitization**: Ensure all Zod schemas are strict and validate all inputs across all server functions.
- **Rate Limiting**: Optimize the current memory-based rate limiter and apply it consistently across all sensitive actions (login, proxy, admin actions).

## 3. Data & Database Security
- **RLS Audit**: Verify all Supabase tables have RLS enabled and that policies follow the "least privilege" principle.
- **Owner Verification**: Ensure all user-facing data modifications are scoped to `auth.uid()`.
- **Secret Management**: Verify `.env` variables are correctly injected and not exposed to the client bundle.

## 4. Infrastructure & Environment
- **HSTS Implementation**: Ensure `Strict-Transport-Security` is active.
- **Production Flags**: Ensure `NODE_ENV=production` is handled correctly and debug logs are stripped.
- **Dependency Audit**: Run `npm audit` and update vulnerable packages where possible without breaking the site.

## Technical Details
- **CSP Update**: Move from `default-src *` to a whitelist-based approach (`self`, `discord.com`, `google.com`, etc.).
- **SSRF Prevention**: Implement a domain whitelist in the image proxy.
- **Middleware Enhancement**: Add a security middleware to catch and log suspicious requests.

## Expected Outcome
A significantly reduced attack surface, protection against XSS and CSRF, and a more robust infrastructure that handles malicious inputs gracefully.
