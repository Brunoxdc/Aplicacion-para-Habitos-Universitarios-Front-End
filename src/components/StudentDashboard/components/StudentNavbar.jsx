import styles from '../styles'

function NavLogo() {
  return (
    <div style={styles.navLogoBox}>
      <svg width="20" height="20" viewBox="0 0 34 34" fill="none">
        <rect x="3" y="18" width="6" height="13" rx="2" fill="#facc15" />
        <rect x="14" y="10" width="6" height="21" rx="2" fill="#4ade80" />
        <rect x="25" y="5" width="6" height="26" rx="2" fill="#f87171" />
      </svg>
    </div>
  )
}

const StudentNavbar = ({ adminPreviewMode, adminImpersonating, studentName, onExitAdmin, onLogout }) => {
  const isAdminContext = adminPreviewMode || adminImpersonating

  return (
    <nav style={styles.navbar}>
      <div style={styles.navLeft}>
        <NavLogo />
        <span style={styles.navTitle}>Seguimiento de Hábitos</span>
      </div>
      <div style={styles.navRight}>
        <span style={styles.navUser}>
          {adminPreviewMode
            ? `👁 Viendo a ${studentName} (solo lectura)`
            : adminImpersonating
            ? `✏️ Editando como ${studentName}`
            : studentName}
        </span>
        {isAdminContext && (
          <button
            style={styles.btnLogout}
            onClick={onExitAdmin}
            onMouseEnter={e => (e.target.style.background = 'rgba(255,255,255,0.25)')}
            onMouseLeave={e => (e.target.style.background = 'rgba(255,255,255,0.15)')}
          >
            ← Volver al panel admin
          </button>
        )}
        <button
          style={styles.btnLogout}
          onClick={onLogout}
          onMouseEnter={e => (e.target.style.background = 'rgba(255,255,255,0.25)')}
          onMouseLeave={e => (e.target.style.background = 'rgba(255,255,255,0.15)')}
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  )
}

export default StudentNavbar
