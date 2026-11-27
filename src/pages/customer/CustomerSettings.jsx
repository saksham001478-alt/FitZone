// CustomerSettings.jsx — Customer settings with Profile Security and Preferences tabs
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { FormInput } from '../../components/FormInput';

const passwordValidationRules = {
  currentPassword: { required: true, minLength: 6 },
  newPassword: { required: true, minLength: 8 },
  confirmPassword: { required: true, match: 'newPassword' }
};

export default function CustomerSettings() {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'preferences'

  // Preferences local state
  const [preferences, setPreferences] = useState({
    workoutReminders: true,
    dietReminders: true,
    announcements: false,
    orderUpdates: true
  });

  // Password change validation hook
  const {
    values: passwordValues,
    errors: passwordErrors,
    handleChange: handlePasswordChange,
    validate: validatePassword,
    resetForm: resetPasswordForm
  } = useFormValidation(
    {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    passwordValidationRules
  );

  const [passwordError, setPasswordError] = useState('');

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (validatePassword && !validatePassword()) {
      return;
    }

    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    showToast('Password updated successfully!', 'success');
    if (resetPasswordForm) {
      resetPasswordForm();
    }
  };

  const handlePrefChange = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSavePreferences = () => {
    showToast('Preferences saved successfully!', 'success');
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="page-header">
        <h2>Account Settings</h2>
        <p>Manage your account security, theme appearance, and notification preferences.</p>
      </div>

      {/* Tabs */}
      <div className="settings-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          type="button"
          className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('profile')}
        >
          🔒 Security & Password
        </button>
        <button
          type="button"
          className={`btn ${activeTab === 'preferences' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('preferences')}
        >
          ⚙️ App Preferences
        </button>
      </div>

      {/* Tab 1: Profile Security (Password change) */}
      {activeTab === 'profile' && (
        <div className="card settings-content">
          <div className="section-title">
            <h2>Change Password</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
              Ensure your account is protected with a secure password of at least 8 characters.
            </p>
          </div>

          {passwordError && (
            <div
              style={{
                backgroundColor: 'rgba(244, 63, 94, 0.12)',
                color: 'var(--coral)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '16px'
              }}
            >
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} noValidate>
            <FormInput
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordValues.currentPassword}
              onChange={handlePasswordChange}
              error={passwordErrors?.currentPassword}
              placeholder="Enter current password"
              required
            />

            <div className="form-row">
              <FormInput
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordValues.newPassword}
                onChange={handlePasswordChange}
                error={passwordErrors?.newPassword}
                placeholder="Minimum 8 characters"
                required
              />

              <FormInput
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordValues.confirmPassword}
                onChange={handlePasswordChange}
                error={passwordErrors?.confirmPassword}
                placeholder="Re-enter new password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
              Update Password
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Preferences (Dark mode & Notifications) */}
      {activeTab === 'preferences' && (
        <div className="card settings-content">
          {/* Theme Preference */}
          <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
            <div className="section-title">
              <h2>Appearance & Theme</h2>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--bg-primary)',
                padding: '14px 18px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <div>
                <strong>Theme Mode</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '2px 0 0' }}>
                  Current: {darkMode ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
                </p>
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={toggleTheme}
              >
                Switch to {darkMode ? 'Light' : 'Dark'} Mode
              </button>
            </div>
          </div>

          {/* Notification Preferences */}
          <div>
            <div className="section-title">
              <h2>Notification Preferences</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
                Control which alerts and updates you receive from FitZone.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '10px',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <input
                  type="checkbox"
                  checked={preferences.workoutReminders}
                  onChange={() => handlePrefChange('workoutReminders')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.92rem' }}>Workout Reminders</strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    Receive daily motivational reminders and scheduled workout alerts.
                  </span>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '10px',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <input
                  type="checkbox"
                  checked={preferences.dietReminders}
                  onChange={() => handlePrefChange('dietReminders')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.92rem' }}>Diet & Meal Schedule Alerts</strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    Reminders for pre-workout and post-workout nutritional timing.
                  </span>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '10px',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <input
                  type="checkbox"
                  checked={preferences.orderUpdates}
                  onChange={() => handlePrefChange('orderUpdates')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.92rem' }}>Store & Order Updates</strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    Status notifications regarding your gear and supplement orders.
                  </span>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '10px',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <input
                  type="checkbox"
                  checked={preferences.announcements}
                  onChange={() => handlePrefChange('announcements')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.92rem' }}>Gym Offers & Announcements</strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    Exclusive discounts on membership upgrades and pro-shop arrivals.
                  </span>
                </div>
              </label>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSavePreferences}
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
