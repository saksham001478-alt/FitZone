// AdminSettings.jsx — Admin system settings, read-only profile, theme toggles, and notification preferences
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function AdminSettings() {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState('profile');

  // Admin preferences persisted in localStorage
  const [preferences, setPreferences] = useLocalStorage('adminPreferences', {
    memberAlerts: true,
    attendanceReminders: true,
    orderAlerts: true,
    weeklyReport: false,
  });

  const handlePreferenceToggle = (key) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast('Preference updated successfully', 'info');
      return updated;
    });
  };

  const adminName = user?.name || 'Gym Administrator';
  const adminEmail = user?.email || 'admin@fitzone.com';
  const initials = adminName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div>
      <div className="page-header">
        <h2>⚙️ Admin Settings</h2>
        <p>Manage administrative account information and gym dashboard system preferences</p>
      </div>

      {/* Settings Sub-navigation Tabs */}
      <div className="settings-tabs">
        <button
          type="button"
          className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Admin Profile
        </button>
        <button
          type="button"
          className={`settings-tab ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          🎨 System Preferences
        </button>
      </div>

      {activeTab === 'profile' ? (
        /* Profile Tab (Read-only for Admin) */
        <div className="settings-content">
          <div className="card">
            <div className="member-header" style={{ marginBottom: '20px' }}>
              <div
                className="member-avatar"
                style={{
                  width: '64px',
                  height: '64px',
                  fontSize: '1.4rem',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                }}
              >
                {initials}
              </div>
              <div>
                <h3 style={{ marginBottom: '2px' }}>{adminName}</h3>
                <span className="badge badge-premium">Super Administrator</span>
              </div>
            </div>

            <div className="member-details">
              <div className="detail-row">
                <span className="detail-label">📧 Admin Email</span>
                <span>{adminEmail}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">🛡️ Role</span>
                <span>System Administrator</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">🔒 Permissions</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Full Access (Read/Write)</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">🏢 Facility</span>
                <span>FitZone Main Facility</span>
              </div>
            </div>

            <div
              style={{
                marginTop: '20px',
                padding: '12px 16px',
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}
            >
              ℹ️ Administrator profile details and master credentials are set system-wide for security reasons.
            </div>
          </div>
        </div>
      ) : (
        /* Preferences Tab */
        <div className="settings-content">
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Appearance & Interface</h3>

            <div className="settings-option">
              <div className="settings-option-info">
                <h4>Dark Mode Theme</h4>
                <p>Toggle dark or light color theme across the administration interface</p>
              </div>
              <label className="toggle-switch" aria-label="Toggle dark mode theme">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={toggleTheme}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <h3 style={{ margin: '24px 0 16px' }}>System Notifications</h3>

            <div className="settings-option">
              <div className="settings-option-info">
                <h4>New Member Registration Alerts</h4>
                <p>Receive notifications when a new gym member registers online</p>
              </div>
              <label className="toggle-switch" aria-label="Toggle member registration alerts">
                <input
                  type="checkbox"
                  checked={preferences.memberAlerts}
                  onChange={() => handlePreferenceToggle('memberAlerts')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h4>Attendance Tracker Reminders</h4>
                <p>Remind staff to finalize daily gym attendance logs by end of day</p>
              </div>
              <label className="toggle-switch" aria-label="Toggle attendance reminders">
                <input
                  type="checkbox"
                  checked={preferences.attendanceReminders}
                  onChange={() => handlePreferenceToggle('attendanceReminders')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h4>Shop Order Alerts</h4>
                <p>Get notified when a member places a supplement or merchandise order</p>
              </div>
              <label className="toggle-switch" aria-label="Toggle shop order alerts">
                <input
                  type="checkbox"
                  checked={preferences.orderAlerts}
                  onChange={() => handlePreferenceToggle('orderAlerts')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings-option">
              <div className="settings-option-info">
                <h4>Weekly Analytics Summary</h4>
                <p>Generate automatic weekly attendance and revenue reports</p>
              </div>
              <label className="toggle-switch" aria-label="Toggle weekly summary">
                <input
                  type="checkbox"
                  checked={preferences.weeklyReport}
                  onChange={() => handlePreferenceToggle('weeklyReport')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSettings;
