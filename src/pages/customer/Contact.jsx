// Contact.jsx — Contact and feedback form with star rating for customers
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { FormInput } from '../../components/FormInput';
import { StarRating } from '../../components/StarRating';

const validationRules = {
  name: { required: true },
  email: { required: true, email: true },
  subject: { required: true },
  message: { required: true, minLength: 10 }
};

const subjectOptions = [
  { value: 'General', label: 'General Inquiry' },
  { value: 'Complaint', label: 'Complaint' },
  { value: 'Suggestion', label: 'Suggestion & Feedback' },
  { value: 'Equipment Request', label: 'Equipment Request' },
  { value: 'Other', label: 'Other' }
];

export default function Contact() {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [rating, setRating] = useState(5);

  const initialValues = useMemo(
    () => ({
      name: user?.name || '',
      email: user?.email || '',
      subject: 'General',
      message: ''
    }),
    [user]
  );

  const { values, errors, handleChange, validate, resetForm, setValues } = useFormValidation(
    initialValues,
    validationRules
  );

  useEffect(() => {
    if (setValues) {
      setValues(initialValues);
    }
  }, [initialValues, setValues]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate && !validate()) {
      return;
    }

    showToast('Thank you for your feedback! We will get back to you soon.', 'success');
    if (resetForm) {
      resetForm();
    }
    setRating(5);
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="page-header">
        <h2>Contact & Feedback</h2>
        <p>Have questions, equipment requests, or feedback? Let the gym management know.</p>
      </div>

      <div className="card contact-form">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <FormInput
              label="Your Name"
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              error={errors?.name}
              placeholder="Full name"
              required
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              error={errors?.email}
              placeholder="Email address"
              required
            />
          </div>

          <div className="form-group">
            <FormInput
              label="Subject"
              name="subject"
              type="select"
              value={values.subject}
              onChange={handleChange}
              error={errors?.subject}
              options={subjectOptions}
              required
            >
              {subjectOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </FormInput>
          </div>

          {/* Gym Experience Rating */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Rate Your FitZone Experience
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <StarRating
                rating={rating}
                value={rating}
                onRatingChange={setRating}
                onChange={setRating}
                maxRating={5}
              />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                ({rating} out of 5 stars)
              </span>
            </div>
          </div>

          <div className="form-group">
            <FormInput
              label="Your Message / Feedback"
              name="message"
              type="textarea"
              rows={5}
              value={values.message}
              onChange={handleChange}
              error={errors?.message}
              placeholder="Describe your request, issue, or suggestions in detail (minimum 10 characters)..."
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}
