// Simple in-memory rate limiter (per Worker instance).
// Not distributed, but effective against basic abuse from a single IP.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterMs: number } {
  const now = Date.now();
  const b = buckets.get(key);
  
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    
    // Memory leak protection: if the bucket map grows too large, 
    // perform a targeted cleanup of expired keys.
    if (buckets.size > 1000) {
      const keysToDelete: string[] = [];
      for (const [k, v] of buckets) {
        if (v.resetAt <= now) keysToDelete.push(k);
        if (keysToDelete.length > 100) break; // Throttle cleanup per call
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

export function clientIp(request: Request): string {
  const h = request.headers;
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}
