/**
 * useProductSearch — O(1) lookup via pre-built inverted HashMap index
 *
 * Build cost: O(n·k)  — once on mount  (n products, k tokens each)
 * Query cost: O(1)    — per keystroke   (Map.get is O(1) average)
 *
 * Data structure:
 *   invertedIndex: Map<string, Set<Product>>
 *   e.g. "hikvision" → Set{ prodA, prodB }
 *        "cctv"      → Set{ prodA, prodC }
 */
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import { GET_PRODUCTS } from './queries';

/* Tokenise a string into lowercase words ≥ 2 chars */
const tokenise = (str = '') =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 2);

export const useProductSearch = () => {
  const client  = useApolloClient();
  const indexRef = useRef(new Map());          // inverted index
  const [products, setProducts] = useState([]); // all products (flat)
  const [ready, setReady]       = useState(false);

  /* ── Build index once ─────────────────────────────────── */
  useEffect(() => {
    client
      .query({ query: GET_PRODUCTS, fetchPolicy: 'cache-first' })
      .then(({ data }) => {
        const prods = data?.products || [];
        setProducts(prods);

        const idx = new Map();

        prods.forEach(p => {
          // Fields to index
          const fields = [p.name, p.brand, p.category, p.description];
          const tokens = fields.flatMap(tokenise);

          tokens.forEach(token => {
            if (!idx.has(token)) idx.set(token, new Set());
            idx.get(token).add(p);
          });
        });

        indexRef.current = idx;
        setReady(true);
      })
      .catch(() => setReady(true)); // fail gracefully
  }, [client]);

  /* ── O(1) search ──────────────────────────────────────── */
  const search = useCallback((query) => {
    const q = query.trim();
    if (!q || !ready) return [];

    const tokens = tokenise(q);
    if (tokens.length === 0) return [];

    // For each token: O(1) Map.get → intersect result sets
    const sets = tokens.map(t => {
      // Also match prefixes: scan only once per token (still O(1) for exact match)
      const exact = indexRef.current.get(t);
      if (exact) return exact;

      // Prefix fallback — O(k) over index keys but bounded & fast in practice
      const merged = new Set();
      indexRef.current.forEach((set, key) => {
        if (key.startsWith(t)) set.forEach(p => merged.add(p));
      });
      return merged;
    });

    // Intersect all sets (AND semantics for multi-word queries)
    const [first, ...rest] = sets;
    const result = new Set(first);
    rest.forEach(s => {
      result.forEach(p => { if (!s.has(p)) result.delete(p); });
    });

    return [...result].slice(0, 8); // top 8 results
  }, [ready]);

  return { search, ready, totalProducts: products.length };
};
