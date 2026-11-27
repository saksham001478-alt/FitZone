// Login.jsx — Authentication page for Admin and Customer login
import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useFormValidation } from '../hooks/useFormValidation';
import { FormInput } from '../components/FormInput';
import { LoadingSpinner } from '../components/LoadingSpinner';

const validationRules = {
  email: { required: true, email: true },
  password: { required: true, minLength: 6 }
};

export default function Login() {
  const { isAuthenticated, role, login } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('customer'); // 'customer' | 'admin'
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { values, errors, handleChange, validate, resetForm } = useFormValidation(
    { email: '', password: '' },
    validationRules
  );

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin' : '/app'} replace />;
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (validate && !validate()) {
      return;
    }

    setLoading(true);
    try {
      const isAdmin = activeTab === 'admin';
      const result = await login(values.email, values.password, isAdmin);

      if (result && !result.success && result.error) {
        setLoginError(result.error);
        showToast(result.error, 'error');
      } else if (result && result.error) {
        setLoginError(result.error);
        showToast(result.error, 'error');
      } else if (result === false) {
        const errorMsg = 'Invalid email or password';
        setLoginError(errorMsg);
        showToast(errorMsg, 'error');
      } else {
        showToast(`Welcome back to FitZone!`, 'success');
        navigate(isAdmin ? '/admin' : '/app');
      }
    } catch (err) {
      const errorMsg = err?.message || 'Login failed. Please check your credentials.';
      setLoginError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', margin: 0 }}>
            ⚡ FitZone
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.95rem' }}>
            Gym Management & Fitness Portal
          </p>
        </div>

        {/* Tab selection for Admin vs Customer */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${activeTab === 'customer' ? 'active' : ''}`}
            onClick={() => handleTabChange('customer')}
          >
            Customer Login
          </button>
          <button
            type="button"
            className={`auth-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => handleTabChange('admin')}
          >
            Admin Login
          </button>
        </div>

        {loginError && (
          <div
            style={{
              backgroundColor: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid var(--coral)',
              color: 'var(--coral)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontSize: '0.88rem',
              marginBottom: '16px'
            }}
          >
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={errors?.email}
            placeholder={activeTab === 'admin' ? 'admin@fitzone.com' : 'member@example.com'}
            required
            autoComplete="email"
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            error={errors?.password}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loading ? <LoadingSpinner size="sm" /> : `Sign In as ${activeTab === 'admin' ? 'Admin' : 'Customer'}`}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>New member? </span>
          <Link to="/register" style={{ fontWeight: 600 }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
