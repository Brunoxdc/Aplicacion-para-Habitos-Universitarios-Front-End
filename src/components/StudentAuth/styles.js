const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f1f5f9',
    padding: '24px',
  },

  card: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
    padding: '40px 40px 36px',
    width: '100%',
    maxWidth: '420px',
  },

  logoWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  logo: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
  },

  heading: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '6px',
  },
  subheading: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '28px',
  },

  fieldGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#1e293b',
    background: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  hiddenInput: {
    display: 'none',
  },
  fileInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  fileButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    textAlign: 'center',
    lineHeight: '1',
    whiteSpace: 'nowrap',
    padding: '11px 16px',
    borderRadius: '8px',
    background: '#eff6ff',
    color: '#1d4ed8',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    border: '1px solid #bfdbfe',
    transition: 'background 0.2s, border-color 0.2s',
    textDecoration: 'none',
  },
  fileButtonHover: {
    background: '#dbeafe',
    borderColor: '#93c5fd',
  },
  fileName: {
    fontSize: '14px',
    color: '#64748b',
    minWidth: '180px',
  },

  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '10px 14px',
    marginBottom: '16px',
    fontSize: '13px',
    color: '#dc2626',
  },

  btnPrimary: {
    width: '100%',
    padding: '13px',
    background: '#3b82f6',
    color: '#ffffff',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '700',
    marginTop: '8px',
    cursor: 'pointer',
    border: 'none',
    transition: 'background 0.2s',
    letterSpacing: '0.01em',
  },

  divider: {
    borderTop: '1px solid #e2e8f0',
    margin: '24px 0 20px',
  },

  footer: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#64748b',
  },
  link: {
    color: '#3b82f6',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
}

export default styles
