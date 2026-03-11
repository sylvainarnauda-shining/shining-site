// Simple in-memory rate limiter for serverless
// Limits per IP: max requests within a time window
const rateMap = new Map();

const CLEANUP_INTERVAL = 60 * 1000; // 1 min
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of rateMap) {
    if (now - entry.start > entry.window) {
      rateMap.delete(key);
    }
  }
}

export function rateLimit({ maxRequests = 5, windowMs = 60000 } = {}) {
  return function check(request) {
    cleanup();

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const key = `${ip}`;
    const now = Date.now();
    const entry = rateMap.get(key);

    if (!entry || now - entry.start > windowMs) {
      rateMap.set(key, { count: 1, start: now, window: windowMs });
      return { ok: true, remaining: maxRequests - 1 };
    }

    entry.count++;
    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.start + windowMs - now) / 1000);
      return { ok: false, remaining: 0, retryAfter };
    }

    return { ok: true, remaining: maxRequests - entry.count };
  };
}
