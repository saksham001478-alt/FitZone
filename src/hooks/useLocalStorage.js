import { useState, useEffect } from 'react';

/**
 * useLocalStorage — syncs state to localStorage with try/catch error handling.
 * Exact same implementation from Pages.jsx.
 * 
 * @param {string} key - localStorage key
 * @param {*} initialValue - initial state value if key does not exist
 * @returns {[any, Function]} state value and updater function
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error saving localStorage key "${key}":`, err);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
