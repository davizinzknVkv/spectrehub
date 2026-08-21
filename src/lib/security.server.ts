import { getRequest } from "@tanstack/react-start/server";
import { clientIp } from "./rate-limit.server";

/**
 * Logs a security event to the server console.
 * In a real production environment, this should send to a centralized logging service.
 */
export function logSecurityEvent(event: string, context: Record<string, any> = {}) {
  const request = getRequest();
  const ip = request ? clientIp(request) : "unknown";
  const timestamp = new Date().toISOString();
  
  const logData = {
    timestamp,
    event,
    ip,
    path: request?.url,
    method: request?.method,
    ...context,
  };

  // Only log detailed info in dev, keep it clean in prod
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[SECURITY EVENT] ${event}`, logData);
  } else {
    // In production, we log a more condensed version to avoid leaking too much in logs
    // but enough to trace attacks
    console.warn(`[SEC] ${event} | IP: ${ip} | Path: ${request?.url}`);
  }
}

/**
 * Validates that the request is coming from a trusted origin.
 */
export function validateOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  
  if (origin && !origin.includes(host || "")) {
    logSecurityEvent("cross_origin_request_detected", { origin, host });
    // We don't necessarily block it here if CORS is already configured, 
    // but we log it for audit purposes.
  }
}
