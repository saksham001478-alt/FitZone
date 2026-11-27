// Toast.jsx — Fixed top-right toast notification container and items
import React from 'react';
import { useNotification } from '../context/NotificationContext';

/**
 * Toast notification display component
 * Reads active notifications from NotificationContext and displays alerts with colored left borders
 */
export function Toast() {
  const { notifications, dismissToast } = useNotification();

  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="toast-container" aria-live="polite">
      {notifications.map((toast) => {
        const type = toast.type || 'info';
        const message = toast.message || toast.text || '';
        const id = toast.id;

        return (
          <div key={id} className={`toast-item toast-${type}`} role="alert">
            <span className="toast-icon">
              {type === 'success' && '✓'}
              {type === 'error' && '✕'}
              {type === 'warning' && '⚠'}
              {type === 'info' && 'ℹ'}
            </span>
            <span className="toast-message">{message}</span>
            <button
              type="button"
              className="toast-dismiss"
              onClick={() => dismissToast(id)}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Toast;
