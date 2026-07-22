import React from 'react';

function Button({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  disabled = false, 
  onClick, 
  className = '',
  ...props 
}) {
  const variantClass = `btn-${variant}`;
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn ${variantClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
