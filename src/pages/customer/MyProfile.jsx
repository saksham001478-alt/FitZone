// MyProfile.jsx — Customer profile view and edit page
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { FormInput } from '../../components/FormInput';

const validationRules = {
  name: { required: true },
  email: { required: true, email: true },
  phone: { required: true, minLength: 10 },
  goal: { required: true }
};

const goalOptions = [
  { value: 'weight-loss', label: 'Weight Loss' },
  { value: 'weight-gain', label: 'Weight Gain' },
  { value: 'muscle-gain', label: 'Muscle Gain' },
  { value: 'maintenance', label: 'Maintenance' }
];

export default function MyProfile() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialValues = useMemo(() => ({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    goal: user?.goal || 'weight-loss'
  }), [user]);

  const { values, errors, handleChange, validate, resetForm, setValues } = useFormValidation(
    initialValues,
    validationRules
  );

  // Sync form when user changes or toggling edit
  useEffect(() => {
    if (setValues) {
      setValues(initialValues);
    }
  }, [initialValues, setValues]);

  const initials = useMemo(() => {
    if (!user?.name) return 'FZ';
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.name.slice(0, 2).toUpperCase();
  }, [user?.name]);

  const handleCancel = () => {
    if (resetForm) resetForm();
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (validate && !validate()) {
      return;
    }

    setSaving(true);
    try {
      if (updateProfile) {
        await updateProfile({
          name: values.name,
          email: values.email,
          phone: values.phone,
          goal: values.goal
        });
      }
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (err) {
      showToast(err?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const planClass = `badge badge-${(user?.plan || 'basic').toLowerCase()}`;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="page-header">
        <h2>My Profile</h2>
        <p>Manage your personal details, membership credentials, and fitness goals.</p>
      </div>

      <div className="card profile-card">
        {/* Profile Header with Avatar & Details */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            paddingBottom: '20px',
            borderBottom: '1px solid var(--border)',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}
        >
          <div
            className="profile-avatar"
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent)',
              color: 'white',
              fontSize: '1.6rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {initials}
          </div>

          <div className="profile-info" style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                {user?.name || 'Member Name'}
              </h2>
              <span className={planClass}>{user?.plan || 'Basic'} Member</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.92rem' }}>
              {user?.email || 'No email provided'}
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {/* View Mode */}
        {!isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="detail-row">
              <span className="detail-label">Full Name</span>
              <strong>{user?.name || '—'}</strong>
            </div>

            <div className="detail-row">
              <span className="detail-label">Email Address</span>
              <strong>{user?.email || '—'}</strong>
            </div>

            <div className="detail-row">
              <span className="detail-label">Phone Number</span>
              <strong>{user?.phone || '—'}</strong>
            </div>

            <div className="detail-row">
              <span className="detail-label">Membership Tier</span>
              <span className={planClass}>{user?.plan || 'Basic'}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Fitness Goal</span>
              <strong style={{ textTransform: 'capitalize' }}>
                {user?.goal ? user.goal.replace('-', ' ') : 'General Fitness'}
              </strong>
            </div>

            <div className="detail-row">
              <span className="detail-label">Join Date</span>
              <strong>{user?.joinDate || 'N/A'}</strong>
            </div>

            <div className="detail-row">
              <span className="detail-label">Account Role</span>
              <strong style={{ textTransform: 'capitalize' }}>{user?.role || 'Customer'}</strong>
            </div>
          </div>
        ) : (
          /* Edit Mode Form */
          <form onSubmit={handleSave} noValidate>
            <FormInput
              label="Full Name"
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              error={errors?.name}
              required
            />

            <div className="form-row">
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={errors?.email}
                required
              />

              <FormInput
                label="Phone Number"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
                error={errors?.phone}
                required
              />
            </div>

            <div className="form-group">
              <FormInput
                label="Fitness Goal"
                name="goal"
                type="select"
                value={values.goal}
                onChange={handleChange}
                error={errors?.goal}
                options={goalOptions}
                required
              >
                {goalOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </FormInput>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
