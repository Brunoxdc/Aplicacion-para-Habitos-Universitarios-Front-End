import styles from '../styles'

const NewHabitForm = ({ newHabit, setNewHabit, onSubmit, daysOfWeek, toggleDay }) => {
  return (
    <form style={styles.newHabitForm} onSubmit={onSubmit}>
      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Nombre del hábito</label>
        <input
          style={styles.formInput}
          type="text"
          placeholder="Ej. Meditar"
          value={newHabit.nombre}
          onChange={e => setNewHabit(prev => ({ ...prev, nombre: e.target.value }))}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Meta</label>
        <input
          style={styles.formInput}
          type="text"
          placeholder="Ej. 10 min / día"
          value={newHabit.meta}
          onChange={e => setNewHabit(prev => ({ ...prev, meta: e.target.value }))}
        />
      </div>

      <div style={styles.formGroupSmall}>
        <label style={styles.formLabel}>Ícono</label>
        <input
          style={styles.formInput}
          type="text"
          placeholder="✨"
          maxLength={2}
          value={newHabit.icon}
          onChange={e => setNewHabit(prev => ({ ...prev, icon: e.target.value }))}
        />
      </div>

      <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
        <label style={styles.formLabel}>Motivo (opcional)</label>
        <input
          style={styles.formInput}
          type="text"
          placeholder="¿Por qué quieres este hábito?"
          value={newHabit.motivo}
          onChange={e => setNewHabit(prev => ({ ...prev, motivo: e.target.value }))}
        />
      </div>

      <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
        <label style={styles.formLabel}>Días</label>
        <div style={styles.daysSelector}>
          {daysOfWeek.map(day => (
            <span
              key={day.key}
              style={{ ...styles.dayChip, ...(newHabit.dias.includes(day.key) ? styles.dayChipActive : {}) }}
              onClick={() => toggleDay(day.key)}
            >
              {day.label}
            </span>
          ))}
        </div>
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <button type="submit" style={styles.btnPrimary}>
          + Agregar Hábito
        </button>
      </div>
    </form>
  )
}

export default NewHabitForm
