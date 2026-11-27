// CustomerLayout.jsx — Customer member layout with navigation, cart badge, and theme support
import React, { useState } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCartStore } from '../store/cartStore';
import { useNotification } from '../context/NotificationContext';
import { customerNavItems } from '../data/staticData';

const defaultCustomerNav = [
  { path: '/app', label: 'Dashboard', icon: '📊' },
  { path: '/app/profile', label: 'My Profile', icon: '👤' },
  { path: '/app/attendance', label: 'Attendance', icon: '📋' },
  { path: '/app/plan', label: 'My Plan', icon: '💳' },
  { path: '/app/diet', label: 'Diet Plans', icon: '🥗' },
  { path: '/app/fitness', label: 'Fitness Tracker', icon: '🏃' },
  { path: '/app/shop', label: 'Shop', icon: '🛍️' },
  { path: '/app/contact', label: 'Contact', icon: '📞' },
];

/**
 * CustomerLayout component for member-facing routes
 */
export function CustomerLayout() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const cartStore = useCartStore();
  // Notification context imported per specification
  const notificationContext = useNotification();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const itemCount = typeof cartStore.getItemCount === 'function'
    ? cartStore.getItemCount()
    : (cartStore.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0);

  const navItems = customerNavItems && customerNavItems.length > 0 ? customerNavItems : defaultCustomerNav;

  return (
    <div className="app-layout customer-layout">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Customer Navigation Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo">
          <span>💪</span> FitZone
        </div>
        <nav>
          {navItems.map((item) => {
            const destination = item.path || item.to;
            const label = item.label || item.name;
            return (
              <NavLink
                key={destination}
                to={destination}
                end={destination === '/app'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Top Navbar */}
      <header className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>
          <div className="brand">💪 FitZone</div>
        </div>

        <div className="nav-actions">
          {/* Shopping Cart with Badge */}
          <Link
            to="/app/shop/cart"
            className="nav-cart-btn cart-btn"
            aria-label={`Cart with ${itemCount} items`}
            title="View Cart"
          >
            <span className="cart-icon">🛒</span>
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {/* Theme Toggle */}
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* User Name & Greeting */}
          <span className="nav-user-name">
            Hi, {user?.name || 'Member'}
          </span>

          {/* Logout Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}

export default CustomerLayout;
