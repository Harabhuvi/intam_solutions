const Redis = require('ioredis');

const memoryStore = new Map();
let redisClient = null;
let redisReady = false;

const getMemory = (key) => {
  const entry = memoryStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryStore.delete(key);
    return null;
  }
  return entry.value;
};

const setMemory = (key, value, ttlSeconds) => {
  memoryStore.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

const initRedis = () => {
  if (redisClient) return redisClient;

  const redisUrl = process.env.REDIS_URL;
  const redisHost = process.env.REDIS_HOST;

  if (!redisUrl && !redisHost) {
    return null;
  }

  const options = {
    maxRetriesPerRequest: 1,
    enableReadyCheck: true,
    lazyConnect: true,
    retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 1000)),
  };

  redisClient = redisUrl
    ? new Redis(redisUrl, options)
    : new Redis({
        host: redisHost,
        port: Number(process.env.REDIS_PORT || 6379),
        password: process.env.REDIS_PASSWORD || undefined,
        ...options,
      });

  redisClient.on('ready', () => {
    redisReady = true;
    console.log('Redis cache connected');
  });

  redisClient.on('error', (err) => {
    if (redisReady) {
      console.warn('Redis error, using memory fallback:', err.message);
    }
    redisReady = false;
  });

  redisClient.on('close', () => {
    redisReady = false;
  });

  redisClient.connect().catch(() => {
    redisReady = false;
  });

  return redisClient;
};

initRedis();

const get = async (key) => {
  if (redisReady && redisClient) {
    try {
      const raw = await redisClient.get(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return getMemory(key);
    }
  }
  return getMemory(key);
};

const set = async (key, value, ttlSeconds = 60) => {
  setMemory(key, value, ttlSeconds);
  if (redisReady && redisClient) {
    try {
      await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      // memory fallback already updated
    }
  }
};

const del = async (...keys) => {
  const flat = keys.flat().filter(Boolean);
  for (const key of flat) {
    memoryStore.delete(key);
  }
  if (redisReady && redisClient && flat.length > 0) {
    try {
      await redisClient.del(...flat);
    } catch {
      // ignore
    }
  }
};

const delByPrefix = async (prefix) => {
  for (const key of memoryStore.keys()) {
    if (key.startsWith(prefix)) memoryStore.delete(key);
  }
  if (redisReady && redisClient) {
    try {
      const keys = await redisClient.keys(`${prefix}*`);
      if (keys.length > 0) await redisClient.del(...keys);
    } catch {
      // ignore
    }
  }
};

const getOrSet = async (key, ttlSeconds, fetcher) => {
  const cached = await get(key);
  if (cached !== null) {
    return { data: cached, cacheHit: true, source: redisReady ? 'redis' : 'memory' };
  }
  const fresh = await fetcher();
  await set(key, fresh, ttlSeconds);
  return { data: fresh, cacheHit: false, source: 'database' };
};

const getStatus = () => ({
  mode: redisReady ? 'redis' : 'memory-fallback',
  redisConfigured: Boolean(process.env.REDIS_URL || process.env.REDIS_HOST),
  redisConnected: redisReady,
  memoryKeys: memoryStore.size,
});

module.exports = {
  initRedis,
  get,
  set,
  del,
  delByPrefix,
  getOrSet,
  getStatus,
};
