// NotificationContext.jsx — Toast notification context managing temporary alerts
import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const timersRef = useRef({});

  /**
   * Dismiss a specific notification by its ID
   */
  const dismissToast = useCallback((id) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  /**
   * Show a toast notification with auto-removal after 3 seconds
   * 
   * @param {string} message - Notification message text
   * @param {'success'|'error'|'info'|'warning'} [type='success'] - Alert type
   * @returns {string} ID of created toast
   */
  const showToast = useCallback(
    (message, type = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const normalizedType = ['success', 'error', 'info', 'warning'].includes(type)
        ? type
        : 'info';

      const newToast = {
        id,
        message,
        type: normalizedType,
      };

      setNotifications((prev) => [...prev, newToast]);

      const timerId = setTimeout(() => {
        dismissToast(id);
      }, 3000);

      timersRef.current[id] = timerId;
      return id;
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({
      notifications,
      showToast,
      dismissToast,
    }),
    [notifications, showToast, dismissToast]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

export default NotificationContext;
