import { useMemo } from 'react';

/**
 * useSearch — filter items with useMemo based on searchTerm and target keys.
 * Exact same implementation from Pages.jsx with safety checks.
 * 
 * @param {Array} items - array of objects to search through
 * @param {string} searchTerm - search query
 * @param {Array<string>} keys - array of keys to test (default: ['name'])
 * @returns {Array} filtered items
 */
export function useSearch(items, searchTerm = '', keys = ['name']) {
  return useMemo(() => {
    if (!items || !Array.isArray(items)) return [];
    if (!searchTerm || typeof searchTerm !== 'string' || !searchTerm.trim()) {
      return items;
    }
    const term = searchTerm.toLowerCase().trim();
    return items.filter((item) =>
      keys.some((key) => {
        const val = item?.[key];
        return val != null && String(val).toLowerCase().includes(term);
      })
    );
  }, [items, searchTerm, keys]);
}

export default useSearch;
