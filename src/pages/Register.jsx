// Register.jsx — Customer registration page
import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useFormValidation } from '../hooks/useFormValidation';
import { FormInput } from '../components/FormInput';
import { LoadingSpinner } from '../components/LoadingSpinner';

const validationRules = {
  name: { required: true },
  email: { required: true, email: true },
  phone: { required: true, minLength: 10 },
  password: { required: true, minLength: 8 },
  confirmPassword: { required: true, match: 'password' },
  goal: { required: true },
  plan: { required: true }
};

const goalOptions = [
  { value: 'weight-loss', label: 'Weight Loss' },
  { value: 'weight-gain', label: 'Weight Gain' },
  { value: 'muscle-gain', label: 'Muscle Gain' },
  { value: 'maintenance', label: 'Maintenance' }
];

const planOptions = [
  { value: 'Basic', label: 'Basic Plan ($15/mo)' },
  { value: 'Standard', label: 'Standard Plan ($30/mo)' },
  { value: 'Premium', label: 'Premium Plan ($55/mo)' }
];

export default function Register() {
  const { isAuthenticated, role, register } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const { values, errors, handleChange, validate } = useFormValidation(
    {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      goal: 'weight-loss',
      plan: 'Basic'
    },
    validationRules
  );

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin' : '/app'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');

    if (validate && !validate()) {
      return;
    }

    if (values.password !== values.confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        goal: values.goal,
        plan: values.plan
      });

      if (result && !result.success && result.error) {
        setRegisterError(result.error);
        showToast(result.error, 'error');
      } else if (result && result.error) {
        setRegisterError(result.error);
        showToast(result.error, 'error');
      } else if (result === false) {
        const errorMsg = 'Registration failed. Email may already be registered.';
        setRegisterError(errorMsg);
        showToast(errorMsg, 'error');
      } else {
        showToast('Welcome to FitZone!', 'success');
        navigate('/app');
      }
    } catch (err) {
      const errorMsg = err?.message || 'Registration failed. Please try again.';
      setRegisterError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card" style={{ maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', margin: 0 }}>
            ⚡ FitZone
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.95rem' }}>
            Start your fitness journey today
          </p>
        </div>

        {registerError && (
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
            {registerError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <FormInput
            label="Full Name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            error={errors?.name}
            placeholder="e.g. Alex Johnson"
            required
            autoComplete="name"
          />

          <div className="form-row">
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              error={errors?.email}
              placeholder="alex@example.com"
              required
              autoComplete="email"
            />
            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={handleChange}
              error={errors?.phone}
              placeholder="10-digit number"
              required
              autoComplete="tel"
            />
          </div>

          <div className="form-row">
            <FormInput
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              error={errors?.password}
              placeholder="Min. 8 characters"
              required
              autoComplete="new-password"
            />
            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange}
              error={errors?.confirmPassword}
              placeholder="Re-enter password"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-row">
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

            <FormInput
              label="Membership Plan"
              name="plan"
              type="select"
              value={values.plan}
              onChange={handleChange}
              error={errors?.plan}
              options={planOptions}
              required
            >
              {planOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </FormInput>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '12px' }}
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Already a member? </span>
          <Link to="/login" style={{ fontWeight: 600 }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
