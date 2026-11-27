// FormInput.jsx — Reusable form input, select, and textarea component
import React from 'react';

/**
 * Reusable FormInput component supporting input, select, and textarea.
 * Displays label, required asterisk (*), and validation error message.
 */
export function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  options = [],
  rows = 4,
  id,
  className = '',
  ...rest
}) {
  const inputId = id || name;
  const inputClass = `${error ? 'error input-error' : ''} ${className}`.trim();

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId}>
          {label}
          {required && <span className="required"> *</span>}
        </label>
      )}

      {type === 'select' ? (
        <select
          id={inputId}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={inputClass}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt, index) => {
            const optValue = typeof opt === 'object' && opt !== null ? opt.value : opt;
            const optLabel = typeof opt === 'object' && opt !== null ? opt.label : opt;
            return (
              <option key={opt?.key || `${optValue}-${index}`} value={optValue}>
                {optLabel}
              </option>
            );
          })}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={inputId}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          className={inputClass}
          {...rest}
        />
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClass}
          {...rest}
        />
      )}

      {error && <span className="error-text error-message">{error}</span>}
    </div>
  );
}

/**
 * Convenience wrapper for <select>
 */
export function FormSelect(props) {
  return <FormInput type="select" {...props} />;
}

/**
 * Convenience wrapper for <textarea>
 */
export function FormTextarea(props) {
  return <FormInput type="textarea" {...props} />;
}

export default FormInput;
