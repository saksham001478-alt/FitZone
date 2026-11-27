// LoadingSpinner.jsx — Simple loading spinner component
import React from 'react';

/**
 * Centered loading spinner with animation and optional message
 */
export function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <div className="spinner" />
      {message && <p>{message}</p>}
    </div>
  );
}

export default LoadingSpinner;
