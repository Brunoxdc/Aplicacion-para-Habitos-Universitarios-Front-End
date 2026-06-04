const styles = {
  
  page: {
    minHeight: '100vh',
    background: '#f1f5f9',
  },

  
  navbar: {
    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    padding: '0 32px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 12px rgba(124,58,237,0.30)',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  navLogoBox: {
    width: '36px',
    height: '36px',
    background: 'rgba(255,255,255,0.20)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    color: '#ffffff',
    fontSize: '17px',
    fontWeight: '700',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  navUser: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '14px',
    fontWeight: '500',
  },
  btnLogout: {
    padding: '8px 18px',
    background: 'rgba(255,255,255,0.15)',
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.30)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },


  content: {
    padding: '36px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  pageTitle: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '4px',
  },
  pageSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '28px',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
  },
  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: '700',
    lineHeight: 1,
  },

  
  tableSection: {
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  tableHeaderRow: {
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e2e8f0',
  },
  tableTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#0f172a',
  },
  searchInput: {
    padding: '9px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#334155',
    width: '240px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },

  
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '11px 24px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderBottom: '1px solid #e2e8f0',
    background: '#f8fafc',
  },
  td: {
    padding: '14px 24px',
    fontSize: '14px',
    color: '#1e293b',
    borderBottom: '1px solid #f1f5f9',
  },
  tdMuted: {
    padding: '14px 24px',
    fontSize: '14px',
    color: '#64748b',
    borderBottom: '1px solid #f1f5f9',
  },

  
  badgeActivo: {
    display: 'inline-block',
    padding: '3px 12px',
    background: '#dcfce7',
    color: '#16a34a',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeInactivo: {
    display: 'inline-block',
    padding: '3px 12px',
    background: '#fff7ed',
    color: '#c2410c',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgePendiente: {
    display: 'inline-block',
    padding: '3px 12px',
    background: '#eff6ff',
    color: '#1d4ed8',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '600',
  },

 
  btnVer: {
    padding: '6px 16px',
    background: '#ffffff',
    color: '#334155',
    border: '1.5px solid #cbd5e1',
    borderRadius: '7px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    marginRight: '8px',
    transition: 'border-color 0.2s, color 0.2s',
  },
  btnEditar: {
    padding: '6px 16px',
    background: '#ffffff',
    color: '#334155',
    border: '1.5px solid #cbd5e1',
    borderRadius: '7px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'border-color 0.2s, color 0.2s',
  },
}

export default styles
