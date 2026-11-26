import { useCallback, useSyncExternalStore } from 'react';
import { useApolloClient } from '@apollo/client';
import { GET_PRODUCTS } from './queries';

const MIN_TOKEN_LENGTH = 2;
const PREFIX_CACHE_MAX_ENTRIES = 32;
const PREFIX_CACHE_MAX_IDS = 256;
const storesByClient = new WeakMap();

const tokenize = (value = '') => value
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, ' ')
  .split(/\s+/)
  .filter((token) => token.length >= MIN_TOKEN_LENGTH);

const lowerBound = (values, target) => {
  let low = 0;
  let high = values.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    if (values[middle] < target) low = middle + 1;
    else high = middle;
  }
  return low;
};

const findPrefixEnd = (prefix) => {
  const lastCharacter = prefix.charCodeAt(prefix.length - 1);
  return prefix.slice(0, -1) + String.fromCharCode(lastCharacter + 1);
};

const createProductIndex = (products) => {
  const productsById = new Map();
  const rankById = new Map();
  const postings = new Map();

  products.forEach((product, rank) => {
    const id = product.id;
    productsById.set(id, product);
    rankById.set(id, rank);
    const productTokens = new Set([
      ...tokenize(product.name),
      ...tokenize(product.brand),
      ...tokenize(product.category),
      ...tokenize(product.description),
    ]);

    productTokens.forEach((token) => {
      let productIds = postings.get(token);
      if (!productIds) {
        productIds = new Set();
        postings.set(token, productIds);
      }
      productIds.add(id);
    });
  });

  const sortedTokens = [...postings.keys()].sort();
  const prefixCache = new Map();

  const getPrefixPosting = (prefix) => {
    if (prefixCache.has(prefix)) {
      const cached = prefixCache.get(prefix);
      prefixCache.delete(prefix);
      prefixCache.set(prefix, cached);
      return cached;
    }

    const start = lowerBound(sortedTokens, prefix);
    const end = lowerBound(sortedTokens, findPrefixEnd(prefix));
    const productIds = new Set();

    for (let i = start; i < end; i += 1) {
      postings.get(sortedTokens[i]).forEach((id) => productIds.add(id));
    }

    if (productIds.size <= PREFIX_CACHE_MAX_IDS) {
      prefixCache.set(prefix, productIds);
      if (prefixCache.size > PREFIX_CACHE_MAX_ENTRIES) {
        prefixCache.delete(prefixCache.keys().next().value);
      }
    }

    return productIds;
  };

  const search = (query, limit = 8, category = null) => {
    const tokens = [...new Set(tokenize(query))];
    if (tokens.length === 0 || limit <= 0) return [];

    const candidateSets = [];
    for (const token of tokens) {
      const exact = postings.get(token);
      const matches = exact || getPrefixPosting(token);
      if (matches.size === 0) return [];
      candidateSets.push(matches);
    }

    candidateSets.sort((a, b) => a.size - b.size);
    const [smallest, ...remaining] = candidateSets;
    const result = [];

    smallest.forEach((id) => {
      const product = productsById.get(id);
      if (!product || (category && product.category !== category)) return;
      if (remaining.every((set) => set.has(id))) result.push(product);
    });

    result.sort((a, b) => rankById.get(a.id) - rankById.get(b.id));
    return result.slice(0, limit);
  };

  return { search };
};

const createStore = (client) => {
  const listeners = new Set();
  const store = {
    snapshot: { ready: false, totalProducts: 0 },
    index: null,
    loading: false,
    subscribe: (listener) => {
      listeners.add(listener);
      if (!store.loading && !store.index) {
        store.loading = true;
        client.query({ query: GET_PRODUCTS, fetchPolicy: 'cache-first' })
          .then(({ data }) => {
            const products = data?.products || [];
            store.index = createProductIndex(products);
            store.snapshot = { ready: true, totalProducts: products.length };
          })
          .catch((error) => {
            console.error('Product search index could not be loaded:', error.message);
            store.index = createProductIndex([]);
            store.snapshot = { ready: true, totalProducts: 0 };
          })
          .finally(() => {
            store.loading = false;
            listeners.forEach((notify) => notify());
          });
      }
      return () => listeners.delete(listener);
    },
    getSnapshot: () => store.snapshot,
    search: (query, limit, category) => store.index?.search(query, limit, category) || [],
  };
  return store;
};

const getStore = (client) => {
  let store = storesByClient.get(client);
  if (!store) {
    store = createStore(client);
    storesByClient.set(client, store);
  }
  return store;
};

export const useProductSearch = () => {
  const client = useApolloClient();
  const store = getStore(client);
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const search = useCallback((query, limit = 8, category = null) => (
    store.search(query, limit, category)
  ), [store]);

  return { search, ready: snapshot.ready, totalProducts: snapshot.totalProducts };
};
