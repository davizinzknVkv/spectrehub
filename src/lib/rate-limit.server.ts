// Secure Rate Limiting System for Worker Runtimes
// Uses per-instance memory and bucketed sliding windows.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/**
 * Standard Token Bucket rate limiter.
 * @param key Unique identifier (e.g., 'ip:endpoint')
 * @param limit Max requests per window
 * @param windowMs Time window in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterMs: number } {
  const now = Date.now();
  const b = buckets.get(key);
  
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    
    // Garbage collection for stale entries to prevent memory exhaustion
    if (buckets.size > 1000) {
      const keysToDelete: string[] = [];
      for (const [k, v] of buckets) {
        if (v.resetAt <= now) {
          keysToDelete.push(k);
        }
        if (keysToDelete.length > 50) break; // Limit work per request
      }
      keysToDelete.forEach(k => buckets.delete(k));
    }
    
    return { ok: true };
  }
  
  if (b.count >= limit) {
    return { ok: false, retryAfterMs: b.resetAt - now };
  }
  
  b.count++;
  return { ok: true };
}

/**
 * Extracts and sanitizes the client IP address from request headers.
 * Prefers Cloudflare specific headers when available.
 */
export function clientIp(request: Request): string {
  const h = request.headers;
  const ip = h.get("cf-connecting-ip") ||
             h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
             h.get("x-real-ip") ||
             "unknown";
  
  // Basic IPv4/IPv6 sanity check to prevent header injection spoofing
  return /^[a-fA-F0-9:.]+$/.test(ip) ? ip : "invalid";
}
