import styles from '../styles'

const HabitHeader = ({ isReadOnly, onOpenCalendar }) => {
  return (
    <div style={styles.habitHeader}>
      <div>
        <p style={styles.sectionTitle}>Mis Hábitos</p>
        <p style={styles.sectionSub}>
          {isReadOnly
            ? 'Estás viendo los hábitos de este estudiante en modo lectura.'
            : 'Crea, edita y da seguimiento a tus hábitos diarios.'}
        </p>
      </div>
      <button
        style={styles.btnCalendar}
        onClick={onOpenCalendar}
        onMouseEnter={e => (e.target.style.background = '#1d4ed8')}
        onMouseLeave={e => (e.target.style.background = '#2563eb')}
      >
        📅 Ver Calendario
      </button>
    </div>
  )
}

export default HabitHeader
