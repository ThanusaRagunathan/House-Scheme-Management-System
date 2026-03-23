import React from 'react';

export const Input = ({ label, type = "text", placeholder, value, onChange, error, ...props }) => {
  return (
    <div style={{ marginBottom: '20px', width: '100%' }}>
      {label && <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '10px',
          border: error ? '1px solid #e03131' : '1px solid #e0e0e0',
          backgroundColor: 'white',
          fontSize: '15px',
          outline: 'none',
          transition: 'var(--transition)',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
        onBlur={(e) => e.target.style.borderColor = error ? '#e03131' : '#e0e0e0'}
        {...props}
      />
      {error && <p style={{ color: '#e03131', fontSize: '12px', marginTop: '5px' }}>{error}</p>}
    </div>
  );
};

export const Select = ({ label, options, value, onChange, error, ...props }) => {
  return (
    <div style={{ marginBottom: '20px', width: '100%' }}>
      {label && <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>{label}</label>}
      <select
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '10px',
          border: error ? '1px solid #e03131' : '1px solid #e0e0e0',
          backgroundColor: 'white',
          fontSize: '15px',
          outline: 'none',
          cursor: 'pointer',
          transition: 'var(--transition)',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
        onBlur={(e) => e.target.style.borderColor = error ? '#e03131' : '#e0e0e0'}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p style={{ color: '#e03131', fontSize: '12px', marginTop: '5px' }}>{error}</p>}
    </div>
  );
};

export const Button = ({ children, variant = "primary", onClick, type = "button", disabled, ...props }) => {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isDanger = variant === "danger";

  let styles = {
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'var(--transition)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    opacity: disabled ? 0.6 : 1,
    boxSizing: 'border-box'
  };

  if (isPrimary) {
    styles = { ...styles, backgroundColor: 'var(--primary)', color: 'white' };
  } else if (isSecondary) {
    styles = { ...styles, backgroundColor: 'rgba(26, 77, 46, 0.1)', color: 'var(--primary)' };
  } else if (isDanger) {
    styles = { ...styles, backgroundColor: '#fff5f5', color: '#e03131' };
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={styles}
      onMouseEnter={(e) => {
        if (!disabled) {
          if (isPrimary) e.currentTarget.style.filter = 'brightness(1.1)';
          else e.currentTarget.style.backgroundColor = isSecondary ? 'rgba(26, 77, 46, 0.15)' : '#ffeaea';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          if (isPrimary) e.currentTarget.style.filter = 'none';
          else e.currentTarget.style.backgroundColor = isSecondary ? 'rgba(26, 77, 46, 0.1)' : '#fff5f5';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, title, subtitle, footer, noPadding }) => {
  return (
    <div className="glass-card" style={{ backgroundColor: 'white', overflow: 'hidden' }}>
      {(title || subtitle) && (
        <div style={{ padding: '20px 25px', borderBottom: '1px solid #f0f0f0' }}>
          {title && <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{title}</h3>}
          {subtitle && <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{subtitle}</p>}
        </div>
      )}
      <div style={{ padding: noPadding ? '0' : '25px' }}>
        {children}
      </div>
      {footer && (
        <div style={{ padding: '15px 25px', borderTop: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
          {footer}
        </div>
      )}
    </div>
  );
};

export const TextArea = ({ label, placeholder, value, onChange, error, rows = 4, ...props }) => {
  return (
    <div style={{ marginBottom: '20px', width: '100%' }}>
      {label && <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>{label}</label>}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '10px',
          border: error ? '1px solid #e03131' : '1px solid #e0e0e0',
          backgroundColor: 'white',
          fontSize: '15px',
          outline: 'none',
          transition: 'var(--transition)',
          boxSizing: 'border-box',
          resize: 'vertical',
          minHeight: '100px'
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
        onBlur={(e) => e.target.style.borderColor = error ? '#e03131' : '#e0e0e0'}
        {...props}
      />
      {error && <p style={{ color: '#e03131', fontSize: '12px', marginTop: '5px' }}>{error}</p>}
    </div>
  );
};
