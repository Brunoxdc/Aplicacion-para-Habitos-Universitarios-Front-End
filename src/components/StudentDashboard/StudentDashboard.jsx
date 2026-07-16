import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles'
import StudentNavbar from './components/StudentNavbar'
import WelcomeSection from './components/WelcomeSection'
import HabitHeader from './components/HabitHeader'
import NewHabitForm from './components/NewHabitForm'
import HabitCard from './components/HabitCard'
import {
  createHabit,
  deleteHabit,
  getHabits,
  patchStudentPhoto,
  updateHabit,
} from '../../api/client'

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
  const previewPhoto = adminPreviewMode ? localStorage.getItem('adminPreviewPhoto') || '' : ''

  const studentName = adminPreviewMode
    ? (previewName || 'Estudiante')
    : (localStorage.getItem('studentName') || 'Estudiante')
  const studentEmail = adminPreviewMode ? previewEmail : (localStorage.getItem('studentEmail') || '')
  const studentPhoto = adminPreviewMode
    ? previewPhoto
    : (localStorage.getItem('studentPhoto') || '')
  const initials = studentName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
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

    let ignore = false
    setLoading(true)
    getHabits(studentEmail)
      .then(({ data }) => {
        if (!ignore) setHabits(data || [])
      })
      .catch((err) => {
        if (!ignore) setError(err.message || 'No se pudieron cargar tus hábitos.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => { ignore = true }
  }, [navigate, studentEmail, adminPreviewMode, previewEmail])

  const handleExitAdmin = () => {
    if (adminPreviewMode) {
      localStorage.removeItem('adminPreviewMode')
      localStorage.removeItem('adminPreviewEmail')
      localStorage.removeItem('adminPreviewName')
      localStorage.removeItem('adminPreviewPhoto')
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

  const saveProfilePhoto = async (photoData) => {
    try {
      await patchStudentPhoto(studentEmail, photoData)
      localStorage.setItem('studentPhoto', photoData)
      setStudentPhotoState(photoData)
    } catch (err) {
      setError(err.message || 'No se pudo actualizar la foto de perfil.')
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
      saveProfilePhoto(reader.result)
      setOpenProfileMenu(false)
      setError('')
    }
    reader.onerror = () => {
      setError('No se pudo cargar la imagen. Intenta nuevamente.')
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveProfilePhoto = async () => {
    if (isReadOnly) return
    try {
      await patchStudentPhoto(studentEmail, '')
      localStorage.removeItem('studentPhoto')
      setStudentPhotoState('')
      setOpenProfileMenu(false)
    } catch (err) {
      setError(err.message || 'No se pudo quitar la foto de perfil.')
    }
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

  const handleAddHabit = async (e) => {
    if (isReadOnly) return
    e.preventDefault()
    if (!newHabit.nombre.trim() || !newHabit.meta.trim()) {
      setError('Agrega un nombre y una meta para el hábito.')
      return
    }

    try {
      const { data: created } = await createHabit(studentEmail, {
        icon: newHabit.icon || '✨',
        nombre: newHabit.nombre.trim(),
        meta: newHabit.meta.trim(),
        dias: newHabit.dias,
        motivo: newHabit.motivo.trim(),
        actividades: [],
      })
      setHabits(prev => [...prev, created])
      setNewHabit({ nombre: '', meta: '', icon: '', dias: [], motivo: '' })
      setError('')
    } catch (err) {
      setError(err.message || 'No se pudo crear el hábito.')
    }
  }

  const applyHabitUpdate = async (habitId, patch) => {
    try {
      const { data: updated } = await updateHabit(studentEmail, habitId, patch)
      setHabits(prev => prev.map(habit => (habit.id === habitId ? updated : habit)))
      return updated
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el hábito.')
      return null
    }
  }

  const handleActivityChange = (habitId, value) => {
    setActivityText(prev => ({ ...prev, [habitId]: value }))
  }

  const handleAddActivity = async (habitId) => {
    if (isReadOnly) return
    const text = (activityText[habitId] || '').trim()
    if (!text) return

    const habit = habits.find(h => h.id === habitId)
    if (!habit) return

    const nextActividades = [
      ...habit.actividades,
      {
        id: Date.now(),
        texto: text,
        completada: false,
        fecha: new Date().toLocaleDateString(),
        fechaVence: activityDueDate[habitId] || '',
      },
    ]

    const updated = await applyHabitUpdate(habitId, { actividades: nextActividades })
    if (updated) {
      setActivityText(prev => ({ ...prev, [habitId]: '' }))
      setActivityDueDate(prev => ({ ...prev, [habitId]: '' }))
    }
  }

  const toggleActivityCompletion = async (habitId, activityId) => {
    if (isReadOnly) return
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return
    const nextActividades = habit.actividades.map(activity =>
      activity.id === activityId ? { ...activity, completada: !activity.completada } : activity
    )
    await applyHabitUpdate(habitId, { actividades: nextActividades })
  }

  const handleRemoveActivity = async (habitId, activityId) => {
    if (isReadOnly) return
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta actividad?')
    if (!confirmed) return
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return
    const nextActividades = habit.actividades.filter(activity => activity.id !== activityId)
    await applyHabitUpdate(habitId, { actividades: nextActividades })
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

  const handleSaveActivityEdit = async () => {
    if (isReadOnly) return
    const texto = editingActivity.texto.trim()
    if (!texto) {
      setError('El texto de la actividad no puede estar vacío.')
      return
    }
    const habit = habits.find(h => h.id === editingActivity.habitId)
    if (!habit) return
    const nextActividades = habit.actividades.map(activity =>
      activity.id === editingActivity.activityId
        ? { ...activity, texto, fechaVence: editingActivity.fechaVence || '' }
        : activity
    )
    const updated = await applyHabitUpdate(editingActivity.habitId, { actividades: nextActividades })
    if (updated) {
      setEditingActivity({ habitId: null, activityId: null, texto: '', fechaVence: '' })
      setError('')
    }
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

  const handleSaveHabitEdit = async (habitId) => {
    if (isReadOnly) return
    const trimmedName = editingHabitValues.nombre.trim()
    const trimmedMeta = editingHabitValues.meta.trim()
    if (!trimmedName || !trimmedMeta) {
      setError('El nombre y la meta del hábito no pueden estar vacíos.')
      return
    }
    const updated = await applyHabitUpdate(habitId, {
      nombre: trimmedName,
      meta: trimmedMeta,
      icon: editingHabitValues.icon || '✨',
      dias: editingHabitValues.dias,
      motivo: editingHabitValues.motivo.trim(),
    })
    if (updated) {
      setEditingHabitId(null)
      setEditingHabitValues({ nombre: '', meta: '', icon: '', dias: [], motivo: '' })
      setError('')
    }
  }

  const handleCancelEditHabit = () => {
    setEditingHabitId(null)
    setEditingHabitValues({ nombre: '', meta: '', icon: '', dias: [], motivo: '' })
    setError('')
  }

  const handleResetHabitProgress = async (habitId) => {
    if (isReadOnly) return
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return
    const nextActividades = habit.actividades.map(activity => ({ ...activity, completada: false }))
    await applyHabitUpdate(habitId, { actividades: nextActividades })
  }

  const handleRemoveHabit = async (habitId) => {
    if (isReadOnly) return
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este hábito?')
    if (!confirmed) return
    try {
      await deleteHabit(studentEmail, habitId)
      setHabits(prev => prev.filter(habit => habit.id !== habitId))
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el hábito.')
    }
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
      <StudentNavbar
        adminPreviewMode={adminPreviewMode}
        adminImpersonating={adminImpersonating}
        studentName={studentName}
        onExitAdmin={handleExitAdmin}
        onLogout={handleLogout}
      />

      <main style={styles.content}>
        <WelcomeSection
          studentPhotoState={studentPhotoState}
          initials={initials}
          studentName={studentName}
          isReadOnly={isReadOnly}
          openProfileMenu={openProfileMenu}
          toggleProfileMenu={toggleProfileMenu}
          onChoosePhoto={() => {
            photoInputRef.current?.click()
            setOpenProfileMenu(false)
          }}
          onRemovePhoto={handleRemoveProfilePhoto}
          onProfilePhotoChange={handleProfilePhotoChange}
          photoInputRef={photoInputRef}
        />

        <HabitHeader
          isReadOnly={isReadOnly}
          onOpenCalendar={() => navigate('/calendar')}
        />

        {!isReadOnly && (
          <NewHabitForm
            newHabit={newHabit}
            setNewHabit={setNewHabit}
            onSubmit={handleAddHabit}
            daysOfWeek={DAYS_OF_WEEK}
            toggleDay={toggleDay}
          />
        )}

        {error && <div style={styles.errorBox}>{error}</div>}

        {loading ? (
          <p style={styles.emptyText}>Cargando hábitos...</p>
        ) : (
          <div style={styles.habitsGrid}>
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isReadOnly={isReadOnly}
                openHabitMenu={openHabitMenu}
                toggleHabitMenu={toggleHabitMenu}
                handleStartEditHabit={handleStartEditHabit}
                handleResetHabitProgress={handleResetHabitProgress}
                handleRemoveHabit={handleRemoveHabit}
                formatDias={formatDias}
                editingHabitId={editingHabitId}
                editingHabitValues={editingHabitValues}
                setEditingHabitValues={setEditingHabitValues}
                daysOfWeek={DAYS_OF_WEEK}
                toggleDay={toggleDay}
                handleCancelEditHabit={handleCancelEditHabit}
                handleSaveHabitEdit={handleSaveHabitEdit}
                computeProgress={computeProgress}
                editingActivity={editingActivity}
                setEditingActivity={setEditingActivity}
                toggleActivityCompletion={toggleActivityCompletion}
                openActivityMenu={openActivityMenu}
                toggleActivityMenu={toggleActivityMenu}
                handleStartEditActivity={handleStartEditActivity}
                handleRemoveActivity={handleRemoveActivity}
                handleCancelEditActivity={handleCancelEditActivity}
                handleSaveActivityEdit={handleSaveActivityEdit}
                activityText={activityText}
                handleActivityChange={handleActivityChange}
                activityDueDate={activityDueDate}
                setActivityDueDate={setActivityDueDate}
                handleAddActivity={handleAddActivity}
                formatDueDate={formatDueDate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default StudentDashboard
