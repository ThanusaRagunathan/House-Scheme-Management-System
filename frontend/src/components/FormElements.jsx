import React from 'react';

export const Input = ({ label, type = "text", placeholder, value, onChange, error, prefix, ...props }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div style={{ marginBottom: '20px', width: '100%' }}>
      {label && <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>{label}</label>}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        width: '100%',
        borderRadius: '10px',
        border: error ? '1px solid #e03131' : '1px solid #e0e0e0',
        backgroundColor: 'white',
        overflow: 'hidden',
        transition: 'var(--transition)',
        boxSizing: 'border-box'
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
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            flex: 1,
            padding: '12px 16px',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '15px',
            outline: 'none',
            width: '100%',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.target.parentElement.style.borderColor = 'var(--primary)';
            e.target.parentElement.style.boxShadow = '0 0 0 4px rgba(26, 77, 46, 0.1)';
          }}
          onBlur={(e) => {
            e.target.parentElement.style.borderColor = error ? '#e03131' : '#e0e0e0';
            e.target.parentElement.style.boxShadow = 'none';
          }}
          {...props}
        />
        {isPassword && (
          <div 
            onClick={() => setShowPassword(!showPassword)}
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

export const Button = ({ children, variant = "primary", onClick, type = "button", disabled, loading, ...props }) => {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isDanger = variant === "danger";

  let styles = {
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
    transition: 'var(--transition)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    opacity: (disabled || loading) ? 0.6 : 1,
    boxSizing: 'border-box',
    minWidth: '120px'
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
      disabled={disabled || loading}
      style={styles}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          if (isPrimary) e.currentTarget.style.filter = 'brightness(1.1)';
          else e.currentTarget.style.backgroundColor = isSecondary ? 'rgba(26, 77, 46, 0.15)' : '#ffeaea';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          if (isPrimary) e.currentTarget.style.filter = 'none';
          else e.currentTarget.style.backgroundColor = isSecondary ? 'rgba(26, 77, 46, 0.1)' : '#fff5f5';
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
          Loading...
        </>
      ) : children}
    </button>
  );
};

export const Card = ({ children, title, subtitle, footer, noPadding, headerAction }) => {
  return (
    <div className="glass-card" style={{ backgroundColor: 'white', overflow: 'hidden' }}>
      {(title || subtitle || headerAction) && (
        <div style={{ padding: '20px 25px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            {title && <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
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
