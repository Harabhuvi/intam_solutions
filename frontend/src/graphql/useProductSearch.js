
import { useState, useEffect, useRef, useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import { GET_PRODUCTS } from './queries';

const tokenise = (str = '') =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 2);

const lowerBound = (arr, prefix) => {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid] < prefix) lo = mid + 1;
    else hi = mid;
  }
  return lo;
};

export const useProductSearch = () => {
  const client      = useApolloClient();
  const indexRef    = useRef(new Map());   // token → Set<Product>
  const sortedRef   = useRef([]);          // sorted token array for O(log n) prefix
  const prefixCache = useRef(new Map());   // memoised prefix → Set<Product>
  const [products, setProducts] = useState([]);
  const [ready, setReady]       = useState(false);


  useEffect(() => {
    client
      .query({ query: GET_PRODUCTS, fetchPolicy: 'cache-first' })
      .then(({ data }) => {
        const prods = data?.products || [];
        setProducts(prods);

        const idx = new Map();
        prods.forEach(p => {
          const tokens = [p.name, p.brand, p.category, p.description]
            .flatMap(tokenise);
          tokens.forEach(token => {
            if (!idx.has(token)) idx.set(token, new Set());
            idx.get(token).add(p);
          });
        });

        indexRef.current  = idx;
        sortedRef.current = [...idx.keys()].sort();   // O(k log k) — one-time
        prefixCache.current.clear();
        setReady(true);
      })
      .catch(() => setReady(true));
  }, [client]);


  const prefixLookup = useCallback((prefix) => {
    if (prefixCache.current.has(prefix))
      return prefixCache.current.get(prefix);          // O(1) cache hit

    // Binary search: find the range [lo, hi) of keys starting with prefix
    const keys  = sortedRef.current;
    const lo    = lowerBound(keys, prefix);
    const hi    = lowerBound(keys, prefix.slice(0, -1) +
                    String.fromCharCode(prefix.charCodeAt(prefix.length - 1) + 1));

    const merged = new Set();
    for (let i = lo; i < hi; i++) {                   // O(matches) only
      indexRef.current.get(keys[i]).forEach(p => merged.add(p));
    }

    prefixCache.current.set(prefix, merged);           // memoise for next keystroke
    return merged;
  }, []);


  const search = useCallback((query, limit = 8) => {
    const q = query.trim();
    if (!q || !ready) return [];

    const tokens = tokenise(q);
    if (tokens.length === 0) return [];

    const sets = tokens.map(t => {
      const exact = indexRef.current.get(t);           // O(1)
      return exact ?? prefixLookup(t);                 // O(log n) fallback
    });

    // Intersect all token sets (AND semantics)
    const [first, ...rest] = sets;
    const result = new Set(first);
    rest.forEach(s => {
      result.forEach(p => { if (!s.has(p)) result.delete(p); });
    });

    return [...result].slice(0, limit);
  }, [ready, prefixLookup]);

  return { search, ready, totalProducts: products.length };
};
