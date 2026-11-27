// AdminLayout.jsx — Admin dashboard layout with fixed sidebar, responsive navbar, and search
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCartStore } from '../store/cartStore';
import { adminNavItems } from '../data/staticData';
import { SearchBar } from './SearchBar';

const defaultAdminNav = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/members', label: 'Members', icon: '👥' },
  { path: '/admin/plans', label: 'Plans', icon: '💳' },
  { path: '/admin/attendance', label: 'Attendance', icon: '📋' },
  { path: '/admin/diet', label: 'Diet Plans', icon: '🥗' },
  { path: '/admin/fitness', label: 'Fitness Tracker', icon: '📈' },
  { path: '/admin/shop', label: 'Shop', icon: '🛍️' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

/**
 * AdminLayout component for admin routes
 */
export function AdminLayout() {
  const { user, members, setMembers, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  // useCartStore imported as per specification
  const cartStore = useCartStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = adminNavItems && adminNavItems.length > 0 ? adminNavItems : defaultAdminNav;

  return (
    <div className="app-layout admin-layout">
      {/* Sidebar Overlay (Mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Admin Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo">
          <span>💪</span> FitZone Admin
        </div>
        <nav>
          {navItems.map((item) => {
            const destination = item.path || item.to;
            const label = item.label || item.name;
            return (
              <NavLink
                key={destination}
                to={destination}
                end={destination === '/admin'}
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

      {/* Admin Top Navbar */}
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
          <div className="brand">💪 FitZone Admin</div>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search members, plans..."
        />

        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <span className="nav-user-name">
            Hi, {user?.name || 'Admin'}
          </span>
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
        <Outlet context={{ members, setMembers, searchTerm }} />
      </main>
    </div>
  );
}

export default AdminLayout;
