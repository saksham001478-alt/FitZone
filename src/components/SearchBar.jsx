// SearchBar.jsx — Controlled search bar with icon and focus reference
import React, { useRef } from 'react';

/**
 * SearchBar component with search icon and focus handling
 */
export function SearchBar({ value = '', onChange, placeholder = 'Search...' }) {
  const inputRef = useRef(null);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="search-bar" onClick={handleContainerClick}>
      <span className="search-icon" aria-hidden="true">🔍</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder || 'Search'}
      />
    </div>
  );
}

export default SearchBar;
