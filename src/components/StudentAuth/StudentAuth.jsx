import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles'
import { studentLogin, studentRegister } from '../../api/client'

const readFileAsDataURL = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = () => reject(new Error('No se pudo leer el archivo.'))
  reader.readAsDataURL(file)
})

const startStudentSession = (student) => {
  localStorage.setItem('isStudentAuthenticated', 'true')
  localStorage.setItem('studentName', student.nombre)
  localStorage.setItem('studentEmail', student.email)
  if (student.photo) {
    localStorage.setItem('studentPhoto', student.photo)
  } else {
    localStorage.removeItem('studentPhoto')
  }
}

function AppIcon() {
  return (
    <div style={styles.logo}>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <rect x="3"  y="18" width="6" height="13" rx="2" fill="#facc15" />
        <rect x="14" y="10" width="6" height="21" rx="2" fill="#4ade80" />
        <rect x="25" y="5"  width="6" height="26" rx="2" fill="#f87171" />
      </svg>
    </div>
  )
}

function LoginForm({ onSwitch }) {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem('isStudentAuthenticated')
    if (auth === 'true') navigate('/dashboard')
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email    = e.target.email.value.trim()
    const password = e.target.password.value

    if (!email || !password) {
      setError('Por favor completa todos los campos.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data: student } = await studentLogin({ email, password })
      startStudentSession(student)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Correo o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  const focusStyle = (e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)' }
  const blurStyle  = (e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }

  return (
    <>
      <div style={styles.logoWrap}><AppIcon /></div>
      <h1 style={styles.heading}>Iniciar Sesión</h1>
      <p style={styles.subheading}>Ingresa a tu cuenta de estudiante</p>

      {error && <div style={styles.errorBox}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={styles.fieldGroup}>
          <label htmlFor="email" style={styles.label}>Correo Electrónico</label>
          <input style={styles.input} type="email" id="email" name="email"
            placeholder="estudiante@universidad.edu" onFocus={focusStyle} onBlur={blurStyle} />
        </div>
        <div style={styles.fieldGroup}>
          <label htmlFor="password" style={styles.label}>Contraseña</label>
          <input style={styles.input} type="password" id="password" name="password"
            placeholder="••••••••" onFocus={focusStyle} onBlur={blurStyle} />
        </div>
        <button type="submit" style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }} disabled={loading}
          onMouseEnter={e => (e.target.style.background = '#2563eb')}
          onMouseLeave={e => (e.target.style.background = '#3b82f6')}>
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div style={styles.divider} />
      <p style={styles.footer}>
        ¿No tienes cuenta?{' '}
        <span style={styles.link} onClick={onSwitch}>Regístrate aquí</span>
      </p>
      <p style={{ ...styles.footer, marginTop: '10px' }}>
        ¿Eres administrador?{' '}
        <span style={{ ...styles.link, color: '#7c3aed' }}
          onClick={() => navigate('/admin')}>
          Acceder como Admin
        </span>
      </p>
    </>
  )
}

function RegisterForm({ onSwitch }) {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [photoName, setPhotoName] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name      = e.target.name.value.trim()
    const email     = e.target.email.value.trim()
    const password  = e.target.password.value
    const confirm   = e.target.confirm.value
    const photoFile = e.target.photo?.files?.[0]

    if (!name || !email || !password || !confirm) {
      setError('Por favor completa todos los campos.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    let photoData = ''
    if (photoFile) {
      try {
        photoData = await readFileAsDataURL(photoFile)
      } catch (err) {
        setError('No se pudo cargar la foto. Intenta nuevamente.')
        return
      }
    }

    setLoading(true)
    setError('')

    try {
      const { data: student } = await studentRegister({
        nombre: name,
        email,
        password,
        photo: photoData,
      })
      startStudentSession(student)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'No se pudo completar el registro.')
    } finally {
      setLoading(false)
    }
  }

  const focusStyle = (e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)' }
  const blurStyle  = (e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }
  const handlePhotoChange = (e) => {
    const selected = e.target.files?.[0]
    setPhotoName(selected ? selected.name : '')
  }

  return (
    <>
      <div style={styles.logoWrap}><AppIcon /></div>
      <h1 style={styles.heading}>Crear Cuenta</h1>
      <p style={styles.subheading}>Regístrate para comenzar a seguir tus hábitos</p>

      {error && <div style={styles.errorBox}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={styles.fieldGroup}>
          <label htmlFor="name" style={styles.label}>Nombre Completo</label>
          <input style={styles.input} type="text" id="name" name="name" placeholder="Juan Pérez" onFocus={focusStyle} onBlur={blurStyle} />
        </div>
        <div style={styles.fieldGroup}>
          <label htmlFor="email" style={styles.label}>Correo Electrónico</label>
          <input style={styles.input} type="email" id="email" name="email" placeholder="estudiante@universidad.edu" onFocus={focusStyle} onBlur={blurStyle} />
        </div>
        <div style={styles.fieldGroup}>
          <label htmlFor="password" style={styles.label}>Contraseña</label>
          <input style={styles.input} type="password" id="password" name="password" placeholder="••••••••" onFocus={focusStyle} onBlur={blurStyle} />
        </div>
        <div style={styles.fieldGroup}>
          <label htmlFor="confirm" style={styles.label}>Confirmar Contraseña</label>
          <input style={styles.input} type="password" id="confirm" name="confirm" placeholder="••••••••" onFocus={focusStyle} onBlur={blurStyle} />
        </div>
        <div style={styles.fieldGroup}>
          <label htmlFor="photo" style={styles.label}>Foto de Perfil (opcional)</label>
          <div style={styles.fileInputWrapper}>
            <label
              htmlFor="photo"
              style={styles.fileButton}
              onMouseEnter={e => { e.target.style.background = '#dbeafe'; e.target.style.borderColor = '#93c5fd' }}
              onMouseLeave={e => { e.target.style.background = '#eff6ff'; e.target.style.borderColor = '#bfdbfe' }}
            >
              📷 Seleccionar imagen
            </label>
            <span style={styles.fileName}>{photoName || 'Ninguna imagen seleccionada'}</span>
          </div>
          <input style={styles.hiddenInput} type="file" id="photo" name="photo" accept="image/*" onChange={handlePhotoChange} />
        </div>
        <button type="submit" style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }} disabled={loading}
          onMouseEnter={e => (e.target.style.background = '#2563eb')}
          onMouseLeave={e => (e.target.style.background = '#3b82f6')}>
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
      </form>

      <div style={styles.divider} />
      <p style={styles.footer}>
        ¿Ya tienes cuenta?{' '}
        <span style={styles.link} onClick={onSwitch}>Inicia sesión aquí</span>
      </p>
    </>
  )
}

const StudentAuth = () => {
  const [view, setView] = useState('login')

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {view === 'login'
          ? <LoginForm    onSwitch={() => setView('register')} />
          : <RegisterForm onSwitch={() => setView('login')}    />
        }
      </div>
    </div>
  )
}

export default StudentAuth
