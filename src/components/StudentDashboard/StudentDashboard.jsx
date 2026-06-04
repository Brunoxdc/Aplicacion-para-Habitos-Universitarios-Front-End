import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles'

const DEFAULT_HABITS = [
  { id: 1, icon: '📚', nombre: 'Lectura diaria',   meta: '30 min / día', dias: [], motivo: '', actividades: [] },
  { id: 2, icon: '🏃', nombre: 'Ejercicio',        meta: '3 veces / sem', dias: [], motivo: '', actividades: [] },
  { id: 3, icon: '💧', nombre: 'Tomar agua',       meta: '2 litros / día', dias: [], motivo: '', actividades: [] },
]

const getUserHabits = (email) => {
  const stored = localStorage.getItem(`habits_${email}`)
  return stored ? JSON.parse(stored) : null
}

const saveUserHabits = (email, habits) => {
  localStorage.setItem(`habits_${email}`, JSON.stringify(habits))
}

const getRegisteredUsers = () => {
  const stored = localStorage.getItem('registeredUsers')
  return stored ? JSON.parse(stored) : []
}

const getRegisteredUser = (email) => {
  return getRegisteredUsers().find(user => user.email === email) || null
}

const getUserPreviewPhoto = (email) => {
  const photoKey = `profilePhoto_${email}`
  const stored = localStorage.getItem(photoKey)
  if (stored) return stored
  const user = getRegisteredUser(email)
  return user?.photo || ''
}

function NavLogo() {
  return (
    <div style={styles.navLogoBox}>
      <svg width="20" height="20" viewBox="0 0 34 34" fill="none">
        <rect x="3"  y="18" width="6" height="13" rx="2" fill="#facc15" />
        <rect x="14" y="10" width="6" height="21" rx="2" fill="#4ade80" />
        <rect x="25" y="5"  width="6" height="26" rx="2" fill="#f87171" />
      </svg>
    </div>
  )
}

const DAYS_OF_WEEK = [
  { key: 'L', label: 'Lun' },
  { key: 'M', label: 'Mar' },
  { key: 'X', label: 'Mié' },
  { key: 'J', label: 'Jue' },
  { key: 'V', label: 'Vie' },
  { key: 'S', label: 'Sáb' },
  { key: 'D', label: 'Dom' },
]

const StudentDashboard = () => {
  const navigate = useNavigate()

  const adminPreviewMode = localStorage.getItem('adminPreviewMode') === 'true' && localStorage.getItem('isAdminAuthenticated') === 'true'
  const adminImpersonating = localStorage.getItem('adminImpersonating') === 'true' && localStorage.getItem('isAdminAuthenticated') === 'true'
  const previewEmail = adminPreviewMode ? localStorage.getItem('adminPreviewEmail') || '' : ''
  const previewName = adminPreviewMode ? localStorage.getItem('adminPreviewName') || '' : ''

  const studentName = adminPreviewMode
    ? (previewName || 'Estudiante')
    : (localStorage.getItem('studentName') || 'Estudiante')
  const studentEmail = adminPreviewMode ? previewEmail : (localStorage.getItem('studentEmail') || '')
  const studentPhoto = adminPreviewMode
    ? (getUserPreviewPhoto(previewEmail) || '')
    : (localStorage.getItem('studentPhoto') || '')
  const initials = studentName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const [habits, setHabits] = useState([])
  const [error, setError] = useState('')
  const [newHabit, setNewHabit] = useState({ nombre: '', meta: '', icon: '', dias: [], motivo: '' })
  const [activityText, setActivityText] = useState({})
  const [activityDueDate, setActivityDueDate] = useState({})
  const [editingHabitId, setEditingHabitId] = useState(null)
  const [editingHabitValues, setEditingHabitValues] = useState({ nombre: '', meta: '', icon: '', dias: [], motivo: '' })
  const [openHabitMenu, setOpenHabitMenu] = useState(null)
  const [openActivityMenu, setOpenActivityMenu] = useState(null)
  const [openProfileMenu, setOpenProfileMenu] = useState(false)
  const [editingActivity, setEditingActivity] = useState({ habitId: null, activityId: null, texto: '', fechaVence: '' })
  const [studentPhotoState, setStudentPhotoState] = useState(studentPhoto)
  const photoInputRef = useRef(null)
  const isReadOnly = adminPreviewMode

  useEffect(() => {
    const auth = localStorage.getItem('isStudentAuthenticated')
    const adminPreviewAllowed = adminPreviewMode && previewEmail
    const adminImpersonationAllowed = adminImpersonating && localStorage.getItem('studentEmail')

    if (auth !== 'true' && !adminPreviewAllowed && !adminImpersonationAllowed) {
      navigate('/login')
      return
    }

    if (!studentEmail) {
      navigate('/login')
      return
    }

    const savedHabits = getUserHabits(studentEmail)
    if (savedHabits) {
      setHabits(savedHabits)
    } else {
      const initialHabits = DEFAULT_HABITS.map(habit => ({ ...habit, actividades: [] }))
      setHabits(initialHabits)
      saveUserHabits(studentEmail, initialHabits)
    }
  }, [navigate, studentEmail, adminPreviewMode, previewEmail])

  const handleExitAdmin = () => {
    if (adminPreviewMode) {
      localStorage.removeItem('adminPreviewMode')
      localStorage.removeItem('adminPreviewEmail')
      localStorage.removeItem('adminPreviewName')
      navigate('/admin/dashboard')
      return
    }
    if (adminImpersonating) {
      localStorage.removeItem('adminImpersonating')
      localStorage.removeItem('isStudentAuthenticated')
      localStorage.removeItem('studentName')
      localStorage.removeItem('studentEmail')
      localStorage.removeItem('studentPhoto')
      navigate('/admin/dashboard')
      return
    }
  }

  const handleLogout = () => {
    if (adminPreviewMode || adminImpersonating) {
      handleExitAdmin()
      return
    }
    localStorage.removeItem('isStudentAuthenticated')
    localStorage.removeItem('studentName')
    localStorage.removeItem('studentEmail')
    localStorage.removeItem('studentPhoto')
    navigate('/login')
  }

  const saveRegisteredUsers = (users) => {
    localStorage.setItem('registeredUsers', JSON.stringify(users))
  }

  const saveProfilePhoto = (photoData) => {
    localStorage.setItem('studentPhoto', photoData)
    localStorage.setItem(`profilePhoto_${studentEmail}`, photoData)
    setStudentPhotoState(photoData)
  }

  const updateUserPhotoInRegisteredUsers = (photoData) => {
    const users = getRegisteredUsers()
    const updatedUsers = users.map(user => {
      if (user.email !== studentEmail) return user
      return { ...user, photo: photoData }
    })
    if (updatedUsers.some(user => user.email === studentEmail)) {
      saveRegisteredUsers(updatedUsers)
    }
  }

  const handleProfilePhotoChange = (event) => {
    if (isReadOnly) return
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Selecciona una imagen válida para la foto de perfil.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const photoData = reader.result
      saveProfilePhoto(photoData)
      updateUserPhotoInRegisteredUsers(photoData)
      setOpenProfileMenu(false)
      setError('')
    }
    reader.onerror = () => {
      setError('No se pudo cargar la imagen. Intenta nuevamente.')
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveProfilePhoto = () => {
    if (isReadOnly) return
    localStorage.removeItem('studentPhoto')
    localStorage.removeItem(`profilePhoto_${studentEmail}`)
    setStudentPhotoState('')
    setOpenProfileMenu(false)
  }

  const toggleProfileMenu = () => {
    setOpenProfileMenu(prev => !prev)
  }

  const computeProgress = (habit) => {
    if (!habit.actividades.length) return 0
    const completed = habit.actividades.filter(a => a.completada).length
    return Math.round((completed / habit.actividades.length) * 100)
  }

  const toggleDay = (day, isEditing = false) => {
    if (isEditing) {
      setEditingHabitValues(prev => {
        const dias = prev.dias.includes(day)
          ? prev.dias.filter(d => d !== day)
          : [...prev.dias, day]
        return { ...prev, dias }
      })
    } else {
      setNewHabit(prev => {
        const dias = prev.dias.includes(day)
          ? prev.dias.filter(d => d !== day)
          : [...prev.dias, day]
        return { ...prev, dias }
      })
    }
  }

  const handleAddHabit = (e) => {
    if (isReadOnly) return
    e.preventDefault()
    if (!newHabit.nombre.trim() || !newHabit.meta.trim()) {
      setError('Agrega un nombre y una meta para el hábito.')
      return
    }

    const nextHabit = {
      id: Date.now(),
      icon: newHabit.icon || '✨',
      nombre: newHabit.nombre.trim(),
      meta: newHabit.meta.trim(),
      dias: newHabit.dias,
      motivo: newHabit.motivo.trim(),
      actividades: [],
    }

    const nextHabits = [...habits, nextHabit]
    setHabits(nextHabits)
    saveUserHabits(studentEmail, nextHabits)
    setNewHabit({ nombre: '', meta: '', icon: '', dias: [], motivo: '' })
    setError('')
  }

  const handleActivityChange = (habitId, value) => {
    setActivityText(prev => ({ ...prev, [habitId]: value }))
  }

  const handleAddActivity = (habitId) => {
    if (isReadOnly) return
    const text = (activityText[habitId] || '').trim()
    if (!text) return

    const nextHabits = habits.map(habit => {
      if (habit.id !== habitId) return habit
      const nextActivities = [
        ...habit.actividades,
        {
          id: Date.now(),
          texto: text,
          completada: false,
          fecha: new Date().toLocaleDateString(),
          fechaVence: activityDueDate[habitId] || '',
        },
      ]
      return { ...habit, actividades: nextActivities }
    })

    setHabits(nextHabits)
    saveUserHabits(studentEmail, nextHabits)
    setActivityText(prev => ({ ...prev, [habitId]: '' }))
    setActivityDueDate(prev => ({ ...prev, [habitId]: '' }))
  }

  const toggleActivityCompletion = (habitId, activityId) => {
    if (isReadOnly) return
    const nextHabits = habits.map(habit => {
      if (habit.id !== habitId) return habit
      const nextActivities = habit.actividades.map(activity => {
        if (activity.id !== activityId) return activity
        return { ...activity, completada: !activity.completada }
      })
      return { ...habit, actividades: nextActivities }
    })
    setHabits(nextHabits)
    saveUserHabits(studentEmail, nextHabits)
  }

  const handleRemoveActivity = (habitId, activityId) => {
    if (isReadOnly) return
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta actividad?')
    if (!confirmed) return
    const nextHabits = habits.map(habit => {
      if (habit.id !== habitId) return habit
      const nextActivities = habit.actividades.filter(activity => activity.id !== activityId)
      return { ...habit, actividades: nextActivities }
    })
    setHabits(nextHabits)
    saveUserHabits(studentEmail, nextHabits)
  }

  const toggleActivityMenu = (habitId, activityId) => {
    const key = `${habitId}_${activityId}`
    setOpenActivityMenu(prev => (prev === key ? null : key))
  }

  const handleStartEditActivity = (habitId, activity) => {
    if (isReadOnly) return
    setEditingActivity({ habitId, activityId: activity.id, texto: activity.texto, fechaVence: activity.fechaVence || '' })
    setOpenActivityMenu(null)
  }

  const handleSaveActivityEdit = () => {
    if (isReadOnly) return
    const texto = editingActivity.texto.trim()
    if (!texto) {
      setError('El texto de la actividad no puede estar vacío.')
      return
    }
    const nextHabits = habits.map(habit => {
      if (habit.id !== editingActivity.habitId) return habit
      const nextActivities = habit.actividades.map(activity => {
        if (activity.id !== editingActivity.activityId) return activity
        return { ...activity, texto, fechaVence: editingActivity.fechaVence || '' }
      })
      return { ...habit, actividades: nextActivities }
    })
    setHabits(nextHabits)
    saveUserHabits(studentEmail, nextHabits)
    setEditingActivity({ habitId: null, activityId: null, texto: '', fechaVence: '' })
    setError('')
  }

  const handleCancelEditActivity = () => {
    setEditingActivity({ habitId: null, activityId: null, texto: '', fechaVence: '' })
    setError('')
  }

  const handleStartEditHabit = (habit) => {
    if (isReadOnly) return
    setEditingHabitId(habit.id)
    setEditingHabitValues({ nombre: habit.nombre, meta: habit.meta, icon: habit.icon, dias: habit.dias || [], motivo: habit.motivo || '' })
    setOpenHabitMenu(null)
  }

  const toggleHabitMenu = (habitId) => {
    setOpenHabitMenu(prev => (prev === habitId ? null : habitId))
  }

  const handleSaveHabitEdit = (habitId) => {
    if (isReadOnly) return
    const trimmedName = editingHabitValues.nombre.trim()
    const trimmedMeta = editingHabitValues.meta.trim()
    if (!trimmedName || !trimmedMeta) {
      setError('El nombre y la meta del hábito no pueden estar vacíos.')
      return
    }
    const nextHabits = habits.map(habit => {
      if (habit.id !== habitId) return habit
      return {
        ...habit,
        nombre: trimmedName,
        meta: trimmedMeta,
        icon: editingHabitValues.icon || '✨',
        dias: editingHabitValues.dias,
        motivo: editingHabitValues.motivo.trim(),
      }
    })
    setHabits(nextHabits)
    saveUserHabits(studentEmail, nextHabits)
    setEditingHabitId(null)
    setEditingHabitValues({ nombre: '', meta: '', icon: '', dias: [], motivo: '' })
    setError('')
  }

  const handleCancelEditHabit = () => {
    setEditingHabitId(null)
    setEditingHabitValues({ nombre: '', meta: '', icon: '', dias: [], motivo: '' })
    setError('')
  }

  const handleResetHabitProgress = (habitId) => {
    if (isReadOnly) return
    const nextHabits = habits.map(habit => {
      if (habit.id !== habitId) return habit
      const resetActivities = habit.actividades.map(activity => ({ ...activity, completada: false }))
      return { ...habit, actividades: resetActivities }
    })
    setHabits(nextHabits)
    saveUserHabits(studentEmail, nextHabits)
  }

  const handleRemoveHabit = (habitId) => {
    if (isReadOnly) return
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este hábito?')
    if (!confirmed) return
    const nextHabits = habits.filter(habit => habit.id !== habitId)
    setHabits(nextHabits)
    saveUserHabits(studentEmail, nextHabits)
  }

  const formatDueDate = (iso) => {
    if (!iso) return null
    try {
      const d = new Date(iso + 'T00:00:00')
      return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch {
      return iso
    }
  }

  const formatDias = (dias) => {
    if (!dias || dias.length === 0) return null
    return dias.join(', ')
  }

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <NavLogo />
          <span style={styles.navTitle}>Seguimiento de Hábitos</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.navUser}>{adminPreviewMode ? `Preview: ${studentName}` : studentName}</span>
          {(adminPreviewMode || adminImpersonating) && (
            <button
              type="button"
              style={{ ...styles.btnSecondary, padding: '8px 16px' }}
              onClick={handleExitAdmin}
              onMouseEnter={e => (e.target.style.background = '#e2e8f0')}
              onMouseLeave={e => (e.target.style.background = '#f8fafc')}
            >
              Volver a Admin
            </button>
          )}
          <button
            style={styles.btnLogout}
            onClick={handleLogout}
            onMouseEnter={e => (e.target.style.background = 'rgba(255,255,255,0.25)')}
            onMouseLeave={e => (e.target.style.background = 'rgba(255,255,255,0.15)')}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <main style={styles.content}>
        <div style={styles.welcomeBox}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={styles.welcomeAvatar}>
                {studentPhotoState ? (
                  <img src={studentPhotoState} alt="Foto de perfil" style={styles.welcomeAvatarImage} />
                ) : (
                  initials
                )}
              </div>
              <div>
                <p style={styles.welcomeTitle}>¡Bienvenido, {studentName.split(' ')[0]}! 👋</p>
                <p style={styles.welcomeSub}>
                  {isReadOnly
                    ? 'Vista previa de estudiante. No se permiten cambios.'
                    : 'Gestión personalizada de tus hábitos y actividades.'}
                </p>
              </div>
            </div>
            {!isReadOnly && (
              <div style={styles.activityMenu}>
                <button type="button" style={styles.activityMenuButton} onClick={toggleProfileMenu}>⋮</button>
                {openProfileMenu && (
                  <div style={styles.activityMenuDropdown}>
                    <button
                      type="button"
                      style={styles.activityMenuItem}
                      onClick={() => { photoInputRef.current?.click(); setOpenProfileMenu(false) }}
                    >
                      📷 Cambiar foto
                    </button>
                    <button type="button" style={styles.activityMenuItemDanger} onClick={handleRemoveProfilePhoto}>
                      🗑 Eliminar foto
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {!isReadOnly && (
            <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePhotoChange} />
          )}
        </div>

        <div style={styles.habitHeader}>
          <div>
            <p style={styles.sectionTitle}>Mis Hábitos</p>
            <p style={styles.sectionSub}>
              {isReadOnly
                ? 'Esta es una vista previa del dashboard del estudiante.'
                : 'Agrega hábitos nuevos y define actividades por cada hábito.'}
            </p>
          </div>
          <button
            type="button"
            style={styles.btnCalendar}
            onClick={() => navigate('/calendar')}
            onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.30)' }}
          >
            📅 Calendario
          </button>
        </div>

        {!isReadOnly && (
          <form style={styles.newHabitForm} onSubmit={handleAddHabit}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Nombre de hábito</label>
              <input
                style={styles.formInput}
                value={newHabit.nombre}
                onChange={e => setNewHabit(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ej. Estudiar 30 minutos"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Meta</label>
              <input
                style={styles.formInput}
                value={newHabit.meta}
                onChange={e => setNewHabit(prev => ({ ...prev, meta: e.target.value }))}
                placeholder="Ej. 5 días a la semana"
              />
            </div>
            <div style={styles.formGroupSmall}>
              <label style={styles.formLabel}>Icono</label>
              <input
                style={styles.formInput}
                value={newHabit.icon}
                onChange={e => setNewHabit(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="Ej. 📖"
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '16px', alignItems: 'start' }}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Días (en los que realizas el hábito)</label>
                <div style={styles.daysSelector}>
                  {DAYS_OF_WEEK.map(d => (
                    <button
                      key={d.key}
                      type="button"
                      style={{
                        ...styles.dayChip,
                        ...(newHabit.dias.includes(d.key) ? styles.dayChipActive : {}),
                      }}
                      onClick={() => toggleDay(d.key)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Motivo (¿Qué quiero lograr?)</label>
                <input
                  style={styles.formInput}
                  value={newHabit.motivo}
                  onChange={e => setNewHabit(prev => ({ ...prev, motivo: e.target.value }))}
                  placeholder="Ej. Mejorar mi concentración y memoria"
                />
              </div>
            </div>

            <button type="submit" style={{ ...styles.btnPrimary, gridColumn: '1 / -1', justifySelf: 'start' }}>
              Agregar hábito
            </button>
          </form>
        )}

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.habitsGrid}>
          {habits.map(habit => (
            <div key={habit.id} style={styles.habitCard}>
              <div style={styles.habitCardHeader}>
                <div style={styles.habitCardHeaderLeft}>
                  <div style={styles.habitIcon}>{habit.icon}</div>
                  <div>
                    <p style={styles.habitName}>{habit.nombre}</p>
                    <p style={styles.habitMeta}>{habit.meta}</p>
                  </div>
                </div>
                {!isReadOnly && (
                  <div style={styles.habitMenu}>
                    <button type="button" style={styles.habitMenuButton} onClick={() => toggleHabitMenu(habit.id)}>⋮</button>
                    {openHabitMenu === habit.id && (
                      <div style={styles.habitMenuDropdown}>
                        <button type="button" style={styles.habitMenuItem} onClick={() => handleStartEditHabit(habit)}>✏️ Editar</button>
                        <button type="button" style={styles.habitMenuItem} onClick={() => handleResetHabitProgress(habit.id)}>🔄 Reiniciar</button>
                        <button type="button" style={styles.habitMenuItemDanger} onClick={() => handleRemoveHabit(habit.id)}>🗑 Eliminar</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {(habit.dias?.length > 0 || habit.motivo) && (
                <div style={styles.habitMetaExtra}>
                  {habit.dias?.length > 0 && (
                    <span style={styles.habitDiasTag}>📅 {formatDias(habit.dias)}</span>
                  )}
                  {habit.motivo && (
                    <span style={styles.habitMotivoTag}>🎯 {habit.motivo}</span>
                  )}
                </div>
              )}

              {editingHabitId === habit.id && (
                <div style={styles.editHabitPanel}>
                  <div style={styles.editHabitRow}>
                    <input
                      style={styles.formInput}
                      value={editingHabitValues.icon}
                      onChange={e => setEditingHabitValues(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="Icono"
                    />
                    <input
                      style={styles.formInput}
                      value={editingHabitValues.nombre}
                      onChange={e => setEditingHabitValues(prev => ({ ...prev, nombre: e.target.value }))}
                      placeholder="Nombre del hábito"
                    />
                  </div>
                  <div style={styles.editHabitRow}>
                    <input
                      style={styles.formInput}
                      value={editingHabitValues.meta}
                      onChange={e => setEditingHabitValues(prev => ({ ...prev, meta: e.target.value }))}
                      placeholder="Meta"
                    />
                    <input
                      style={styles.formInput}
                      value={editingHabitValues.motivo}
                      onChange={e => setEditingHabitValues(prev => ({ ...prev, motivo: e.target.value }))}
                      placeholder="Motivo"
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ ...styles.formLabel, marginBottom: '8px' }}>Días</p>
                    <div style={styles.daysSelector}>
                      {DAYS_OF_WEEK.map(d => (
                        <button
                          key={d.key}
                          type="button"
                          style={{
                            ...styles.dayChip,
                            ...(editingHabitValues.dias.includes(d.key) ? styles.dayChipActive : {}),
                          }}
                          onClick={() => toggleDay(d.key, true)}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={styles.editHabitActions}>
                    <button type="button" style={styles.btnSecondary} onClick={handleCancelEditHabit}>Cancelar</button>
                    <button type="button" style={styles.btnPrimary} onClick={() => handleSaveHabitEdit(habit.id)}>Guardar</button>
                  </div>
                </div>
              )}

              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${computeProgress(habit)}%`, background: '#2563eb' }} />
              </div>
              <p style={styles.progressText}>{computeProgress(habit)}% completado</p>

              <div style={styles.activitySection}>
                <p style={styles.activityTitle}>Actividades</p>
                {habit.actividades.length === 0 ? (
                  <p style={styles.emptyText}>No hay actividades aún.</p>
                ) : (
                  <ul style={styles.activityList}>
                    {habit.actividades.map(activity => {
                      const activityKey = `${habit.id}_${activity.id}`
                      const isEditing = editingActivity.habitId === habit.id && editingActivity.activityId === activity.id
                      return (
                        <li key={activity.id} style={styles.activityItem}>
                          <div style={styles.activityItemLeft}>
                            <button
                              type="button"
                              style={{
                                ...styles.activityButton,
                                cursor: isReadOnly ? 'not-allowed' : 'pointer',
                                opacity: isReadOnly ? 0.5 : 1,
                              }}
                              onClick={() => !isReadOnly && toggleActivityCompletion(habit.id, activity.id)}
                            >
                              {activity.completada ? '✓' : '+'}
                            </button>
                            <div>
                              {isEditing ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  <input
                                    style={styles.activityEditInput}
                                    value={editingActivity.texto}
                                    onChange={e => setEditingActivity(prev => ({ ...prev, texto: e.target.value }))}
                                  />
                                  <input
                                    type="date"
                                    style={{ ...styles.activityEditInput, fontSize: '12px' }}
                                    value={editingActivity.fechaVence}
                                    onChange={e => setEditingActivity(prev => ({ ...prev, fechaVence: e.target.value }))}
                                  />
                                </div>
                              ) : (
                                <div>
                                  <span style={activity.completada ? styles.activityDone : styles.activityText}>
                                    {activity.texto}
                                  </span>
                                  <div style={styles.activityMeta}>
                                    {activity.fechaVence && (
                                      <span style={styles.activityDateTag}>
                                        📅 Vence: {formatDueDate(activity.fechaVence)}
                                      </span>
                                    )}
                                    {habit.dias?.length > 0 && (
                                      <span style={styles.activityDaysTag}>
                                        {formatDias(habit.dias)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={styles.activityItemRight}>
                            {isEditing ? (
                              <div style={styles.activityEditActions}>
                                <button type="button" style={styles.btnSecondary} onClick={handleCancelEditActivity}>Cancelar</button>
                                <button type="button" style={styles.btnPrimary} onClick={handleSaveActivityEdit}>Guardar</button>
                              </div>
                            ) : (
                              !isReadOnly && (
                                <div style={styles.activityMenu}>
                                  <button
                                    type="button"
                                    style={styles.activityMenuButton}
                                    onClick={() => toggleActivityMenu(habit.id, activity.id)}
                                  >
                                    ⋮
                                  </button>
                                  {openActivityMenu === activityKey && (
                                    <div style={styles.activityMenuDropdown}>
                                      <button type="button" style={styles.activityMenuItem} onClick={() => handleStartEditActivity(habit.id, activity)}>✏️ Renombrar</button>
                                      <button type="button" style={styles.activityMenuItemDanger} onClick={() => handleRemoveActivity(habit.id, activity.id)}>✕ Eliminar</button>
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
                {!isReadOnly && (
                  <div style={styles.activityFormExtended}>
                    <input
                      style={{ ...styles.formInput, fontSize: '13px', minWidth: '140px' }}
                      value={activityText[habit.id] || ''}
                      onChange={e => handleActivityChange(habit.id, e.target.value)}
                      placeholder="Nueva actividad"
                    />
                    <input
                      type="date"
                      style={{ ...styles.formInput, fontSize: '13px', minWidth: '140px' }}
                      value={activityDueDate[habit.id] || ''}
                      onChange={e => setActivityDueDate(prev => ({ ...prev, [habit.id]: e.target.value }))}
                      title="Fecha de vencimiento"
                    />
                    <button 
                    type="button" style={styles.btnSecondary} onClick={() => handleAddActivity(habit.id)}>
                      Añadir
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard