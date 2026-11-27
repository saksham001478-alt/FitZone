import { useState, useCallback, useMemo } from 'react';

/**
 * Helper to convert camelCase/snake_case field names into readable labels
 */
function formatLabel(fieldName = '') {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

/**
 * Validate a single field's value against its rule list
 *
 * @param {*} value - The field value to validate
 * @param {Array} rules - Array of validation rule objects
 * @param {Object} allValues - Full form values object (for cross-field validation like 'match')
 * @param {string} fieldName - Name of the field being validated
 * @returns {string} Error message string, or empty string if valid
 */
function validateField(value, rules = [], allValues = {}, fieldName = '') {
  if (!rules || !Array.isArray(rules)) return '';

  const label = formatLabel(fieldName);
  const strVal = value !== null && value !== undefined ? String(value).trim() : '';

  for (const rule of rules) {
    if (!rule || !rule.type) continue;

    switch (rule.type) {
      case 'required': {
        const isEmpty =
          value === null ||
          value === undefined ||
          (typeof value === 'boolean' && !value) ||
          strVal === '' ||
          (Array.isArray(value) && value.length === 0);

        if (isEmpty) {
          return rule.message || `${label} is required`;
        }
        break;
      }

      case 'email': {
        if (strVal) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(strVal)) {
            return rule.message || 'Please enter a valid email address';
          }
        }
        break;
      }

      case 'minLength': {
        if (strVal && strVal.length < rule.value) {
          return (
            rule.message ||
            `${label} must be at least ${rule.value} character${rule.value > 1 ? 's' : ''}`
          );
        }
        break;
      }

      case 'maxLength': {
        if (strVal && strVal.length > rule.value) {
          return (
            rule.message ||
            `${label} cannot exceed ${rule.value} character${rule.value > 1 ? 's' : ''}`
          );
        }
        break;
      }

      case 'match': {
        const targetValue = allValues[rule.field];
        if (value !== targetValue) {
          return (
            rule.message ||
            `${label} must match ${formatLabel(rule.field)}`
          );
        }
        break;
      }

      case 'phone': {
        if (strVal) {
          const digitsOnly = strVal.replace(/\D/g, '');
          const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
          if (!phonePattern.test(strVal) || digitsOnly.length < 10) {
            return (
              rule.message ||
              'Please enter a valid phone number (at least 10 digits)'
            );
          }
        }
        break;
      }

      case 'min': {
        if (strVal !== '') {
          const num = Number(value);
          if (isNaN(num) || num < rule.value) {
            return (
              rule.message ||
              `${label} must be at least ${rule.value}`
            );
          }
        }
        break;
      }

      case 'max': {
        if (strVal !== '') {
          const num = Number(value);
          if (isNaN(num) || num > rule.value) {
            return (
              rule.message ||
              `${label} cannot exceed ${rule.value}`
            );
          }
        }
        break;
      }

      case 'pattern': {
        if (strVal && rule.pattern && !rule.pattern.test(strVal)) {
          return rule.message || `${label} format is invalid`;
        }
        break;
      }

      case 'custom': {
        if (typeof rule.validator === 'function') {
          const customError = rule.validator(value, allValues);
          if (customError) {
            return customError;
          }
        }
        break;
      }

      default:
        break;
    }
  }

  return '';
}

/**
 * Custom hook for form validation
 *
 * @param {Object} initialValues - Object containing initial field values
 * @param {Object} validationRules - Object mapping field names to arrays of rule objects
 * @returns {Object} { values, errors, touched, handleChange, handleBlur, setValue, setValues, validate, resetForm, isValid }
 */
export function useFormValidation(initialValues = {}, validationRules = {}) {
  const [values, setValuesState] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /**
   * Set multiple values or use an updater function
   */
  const setValues = useCallback((newValues) => {
    setValuesState((prev) => {
      const resolved = typeof newValues === 'function' ? newValues(prev) : newValues;
      return { ...resolved };
    });
  }, []);

  /**
   * Set a single field value and re-validate if it's already touched
   */
  const setValue = useCallback(
    (name, value) => {
      setValuesState((prev) => {
        const nextValues = { ...prev, [name]: value };

        if (touched[name]) {
          const fieldError = validateField(
            value,
            validationRules?.[name],
            nextValues,
            name
          );
          setErrors((prevErr) => ({ ...prevErr, [name]: fieldError }));
        }

        // Also re-validate any dependent fields that match on this field
        if (validationRules) {
          Object.entries(validationRules).forEach(([fieldKey, rules]) => {
            if (touched[fieldKey] && Array.isArray(rules)) {
              const hasMatchRule = rules.some(
                (r) => r.type === 'match' && r.field === name
              );
              if (hasMatchRule) {
                const matchErr = validateField(
                  nextValues[fieldKey],
                  rules,
                  nextValues,
                  fieldKey
                );
                setErrors((prevErr) => ({ ...prevErr, [fieldKey]: matchErr }));
              }
            }
          });
        }

        return nextValues;
      });
    },
    [touched, validationRules]
  );

  /**
   * Handle change event from form input, select, or textarea
   */
  const handleChange = useCallback(
    (e) => {
      if (!e || !e.target) return;
      const { name, value, type, checked } = e.target;
      const fieldValue = type === 'checkbox' ? checked : value;
      setValue(name, fieldValue);
    },
    [setValue]
  );

  /**
   * Handle blur event on input to mark field touched and validate it
   */
  const handleBlur = useCallback(
    (e) => {
      if (!e || !e.target) return;
      const { name } = e.target;

      setTouched((prev) => ({ ...prev, [name]: true }));

      const fieldError = validateField(
        values[name],
        validationRules?.[name],
        values,
        name
      );

      setErrors((prevErr) => ({ ...prevErr, [name]: fieldError }));
    },
    [values, validationRules]
  );

  /**
   * Validate all form fields against their rules.
   * Marks all fields as touched and returns true if all fields are valid.
   *
   * @returns {boolean} true if valid, false if there are errors
   */
  const validate = useCallback(() => {
    const nextErrors = {};
    const nextTouched = {};
    let isFormValid = true;

    if (validationRules) {
      Object.keys(validationRules).forEach((fieldName) => {
        nextTouched[fieldName] = true;
        const fieldError = validateField(
          values[fieldName],
          validationRules[fieldName],
          values,
          fieldName
        );
        nextErrors[fieldName] = fieldError;
        if (fieldError) {
          isFormValid = false;
        }
      });
    }

    setTouched((prev) => ({ ...prev, ...nextTouched }));
    setErrors(nextErrors);
    return isFormValid;
  }, [values, validationRules]);

  /**
   * Reset form values, errors, and touched state
   */
  const resetForm = useCallback(
    (newValues = initialValues) => {
      setValuesState(newValues);
      setErrors({});
      setTouched({});
    },
    [initialValues]
  );

  /**
   * Boolean indicating if all current errors are empty
   */
  const isValid = useMemo(() => {
    return Object.values(errors).every((err) => !err);
  }, [errors]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setValue,
    setValues,
    validate,
    resetForm,
    isValid,
  };
}

export default useFormValidation;
