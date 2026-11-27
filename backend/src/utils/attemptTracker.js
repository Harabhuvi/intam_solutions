/**
 * Creates a lightweight in-memory fixed-window attempt tracker for rate limiting
 * sensitive operations like login or contact form submissions.
 */
const createAttemptTracker = ({ windowMs, max }) => {
  const entries = new Map();

  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of entries) {
      if (entry.resetAt <= now) entries.delete(key);
    }
  }, windowMs).unref();

  return {
    isBlocked(key) {
      const entry = entries.get(key);
      return Boolean(entry && entry.resetAt > Date.now() && entry.count >= max);
    },
    record(key) {
      const now = Date.now();
      const entry = entries.get(key);
      if (!entry || entry.resetAt <= now) {
        entries.set(key, { count: 1, resetAt: now + windowMs });
      } else {
        entry.count += 1;
      }
    },
    reset(key) {
      entries.delete(key);
    },
  };
};

module.exports = { createAttemptTracker };
