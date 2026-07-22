import React, { forwardRef } from 'react';

const FormInput = forwardRef(function FormInput(
  { label, error, id, name, type = 'text', value, onChange, placeholder, autoFocus, ...props },
  ref
) {
  const inputId = id || name;

  return (
    <div className={`form-group ${error ? 'has-error' : ''}`}>
      {label && <label htmlFor={inputId} className="form-label">{label}</label>}
      <input
        ref={ref}
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`form-input ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
});

export default FormInput;
