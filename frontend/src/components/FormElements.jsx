import React from 'react';

/**
 * Enhanced Input Component
 */
export const Input = ({ label, type = "text", placeholder, value, onChange, error, prefix, id, required, ...props }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36).substr(2, 9));

  return (
    <div style={{ marginBottom: '20px', width: '100%' }}>
      {label && (
        <label 
          htmlFor={inputId}
          style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '600', 
            color: error ? '#e03131' : 'var(--text-muted)', 
            marginBottom: '8px' 
          }}
        >
          {label} {required && <span style={{ color: '#e03131' }}>*</span>}
        </label>
      )}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        width: '100%',
        borderRadius: '10px',
        border: error ? '1px solid #e03131' : '1px solid #e0e0e0',
        backgroundColor: 'white',
        overflow: 'hidden',
        transition: 'var(--transition)',
        boxSizing: 'border-box',
        boxShadow: error ? '0 0 0 4px rgba(224, 49, 49, 0.05)' : 'none'
      }}
      className="input-container"
      >
        {prefix && (
          <span style={{ 
            padding: '12px 10px 12px 16px', 
            backgroundColor: '#f8f9fa', 
            color: 'var(--text-muted)', 
            borderRight: '1px solid #e0e0e0',
            fontSize: '15px',
            fontWeight: '600'
          }}>
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          required={required}
          style={{
            flex: 1,
            padding: '12px 16px',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '15px',
            outline: 'none',
            width: '100%',
            boxSizing: 'border-box',
            color: 'var(--text-dark)'
          }}
          onFocus={(e) => {
            e.target.parentElement.style.borderColor = error ? '#e03131' : 'var(--primary)';
            e.target.parentElement.style.boxShadow = error 
              ? '0 0 0 4px rgba(224, 49, 49, 0.1)' 
              : '0 0 0 4px rgba(26, 77, 46, 0.1)';
          }}
          onBlur={(e) => {
            e.target.parentElement.style.borderColor = error ? '#e03131' : '#e0e0e0';
            e.target.parentElement.style.boxShadow = error ? '0 0 0 4px rgba(224, 49, 49, 0.05)' : 'none';
          }}
          {...props}
        />
        {isPassword && (
          <div 
            onClick={() => setShowPassword(!showPassword)}
            role="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            style={{ 
              padding: '0 16px', 
              cursor: 'pointer', 
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              userSelect: 'none'
            }}
          >
            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} style={{ fontSize: '18px' }}></i>
          </div>
        )}
      </div>
      {error && (
        <p 
          id={`${inputId}-error`}
          role="alert"
          style={{ color: '#e03131', fontSize: '12px', marginTop: '6px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <i className="bi bi-exclamation-circle-fill"></i> {error}
        </p>
      )}
    </div>
  );
};

/**
 * Enhanced Select Component
 */
export const Select = ({ label, options, value, onChange, error, id, required, ...props }) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36).substr(2, 9));

  return (
    <div style={{ marginBottom: '20px', width: '100%' }}>
      {label && (
        <label 
          htmlFor={selectId}
          style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '600', 
            color: error ? '#e03131' : 'var(--text-muted)', 
            marginBottom: '8px' 
          }}
        >
          {label} {required && <span style={{ color: '#e03131' }}>*</span>}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        required={required}
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
          boxSizing: 'border-box',
          color: 'var(--text-dark)',
          appearance: 'none',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'%23666666\' class=\'bi bi-chevron-down\' viewBox=\'0 0 16 16\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 16px center'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? '#e03131' : 'var(--primary)';
          e.target.style.boxShadow = error 
            ? '0 0 0 4px rgba(224, 49, 49, 0.1)' 
            : '0 0 0 4px rgba(26, 77, 46, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#e03131' : '#e0e0e0';
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p 
          id={`${selectId}-error`}
          role="alert"
          style={{ color: '#e03131', fontSize: '12px', marginTop: '6px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <i className="bi bi-exclamation-circle-fill"></i> {error}
        </p>
      )}
    </div>
  );
};

/**
 * Enhanced Button Component
 */
export const Button = ({ children, variant = "primary", onClick, type = "button", disabled, loading, style, ...props }) => {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isDanger = variant === "danger";

  let baseStyles = {
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    opacity: (disabled || loading) ? 0.6 : 1,
    boxSizing: 'border-box',
    minWidth: '120px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    border: '2px solid transparent'
  };

  let variantStyles = {};
  if (isPrimary) {
    variantStyles = { backgroundColor: 'var(--primary)', color: 'white' };
  } else if (isSecondary) {
    variantStyles = { backgroundColor: 'rgba(26, 77, 46, 0.08)', color: 'var(--primary)' };
  } else if (isDanger) {
    variantStyles = { backgroundColor: '#fff5f5', color: '#e03131' };
  }

  const finalStyles = { ...baseStyles, ...variantStyles, ...style };

  // Helper to get variant colors for hover effect
  const getHoverColors = () => {
    if (isPrimary) return { bg: 'white', text: 'var(--primary)', border: 'var(--primary)' };
    if (isSecondary) return { bg: 'white', text: 'var(--primary)', border: 'var(--primary)' };
    if (isDanger) return { bg: '#e03131', text: 'white', border: '#e03131' };
    return { bg: 'white', text: 'var(--primary)', border: 'var(--primary)' };
  };

  const getNormalColors = () => {
    if (isPrimary) return { bg: 'var(--primary)', text: 'white', border: 'transparent' };
    if (isSecondary) return { bg: 'rgba(26, 77, 46, 0.08)', text: 'var(--primary)', border: 'transparent' };
    if (isDanger) return { bg: '#fff5f5', text: '#e03131', border: 'transparent' };
    return { bg: 'var(--primary)', text: 'white', border: 'transparent' };
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={finalStyles}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          const colors = getHoverColors();
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          e.currentTarget.style.backgroundColor = colors.bg;
          e.currentTarget.style.color = colors.text;
          e.currentTarget.style.border = `2px solid ${colors.border}`;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          const colors = getNormalColors();
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
          e.currentTarget.style.backgroundColor = colors.bg;
          e.currentTarget.style.color = colors.text;
          e.currentTarget.style.border = `2px solid ${colors.border}`;
        }
      }}
      {...props}
    >
      {loading ? (
        <>
          <span style={{ 
            width: '16px', 
            height: '16px', 
            border: '2px solid rgba(255,255,255,0.3)', 
            borderTop: '2px solid white', 
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          Processing...
        </>
      ) : children}
    </button>
  );
};

export const Card = ({ children, title, subtitle, footer, noPadding, headerAction }) => {
  return (
    <div className="glass-card" style={{ backgroundColor: 'white', overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
      {(title || subtitle || headerAction) && (
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            {title && <h3 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: 'var(--text-dark)' }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '6px 0 0 0', lineHeight: '1.5' }}>{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div style={{ padding: noPadding ? '0' : '28px' }}>
        {children}
      </div>
      {footer && (
        <div style={{ padding: '20px 28px', borderTop: '1px solid #f0f0f0', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center' }}>
          {footer}
        </div>
      )}
    </div>
  );
};

/**
 * Enhanced TextArea Component
 */
export const TextArea = ({ label, placeholder, value, onChange, error, rows = 4, id, required, ...props }) => {
  const textAreaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36).substr(2, 9));

  return (
    <div style={{ marginBottom: '20px', width: '100%' }}>
      {label && (
        <label 
          htmlFor={textAreaId}
          style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '600', 
            color: error ? '#e03131' : 'var(--text-muted)', 
            marginBottom: '8px' 
          }}
        >
          {label} {required && <span style={{ color: '#e03131' }}>*</span>}
        </label>
      )}
      <textarea
        id={textAreaId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${textAreaId}-error` : undefined}
        required={required}
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
          minHeight: '100px',
          color: 'var(--text-dark)',
          lineHeight: '1.6'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? '#e03131' : 'var(--primary)';
          e.target.style.boxShadow = error 
            ? '0 0 0 4px rgba(224, 49, 49, 0.1)' 
            : '0 0 0 4px rgba(26, 77, 46, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#e03131' : '#e0e0e0';
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
      {error && (
        <p 
          id={`${textAreaId}-error`}
          role="alert"
          style={{ color: '#e03131', fontSize: '12px', marginTop: '6px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <i className="bi bi-exclamation-circle-fill"></i> {error}
        </p>
      )}
    </div>
  );
};
