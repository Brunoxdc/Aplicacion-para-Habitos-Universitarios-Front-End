const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!res.ok) {
    const message = data?.error || data?.message || `Error ${res.status}`
    throw new Error(message)
  }

  return data
}

// --- Auth ---
export const studentRegister = (payload) =>
  request('/api/auth/student/register', { method: 'POST', body: JSON.stringify(payload) })

export const studentLogin = (payload) =>
  request('/api/auth/student/login', { method: 'POST', body: JSON.stringify(payload) })

export const adminLogin = (payload) =>
  request('/api/auth/admin/login', { method: 'POST', body: JSON.stringify(payload) })

// --- Students ---
export const getStudents = () => request('/api/students')

export const getStudentByEmail = (email) =>
  request(`/api/students/${encodeURIComponent(email)}`)

export const patchStudentPhoto = (email, photo) =>
  request(`/api/students/${encodeURIComponent(email)}/photo`, {
    method: 'PATCH',
    body: JSON.stringify({ photo }),
  })

export const getStudentNotes = (email) =>
  request(`/api/students/${encodeURIComponent(email)}/notes`)

export const upsertStudentNote = (email, isoDate, text) =>
  request(`/api/students/${encodeURIComponent(email)}/notes/${isoDate}`, {
    method: 'PUT',
    body: JSON.stringify({ text }),
  })

export const deleteStudentNote = (email, isoDate) =>
  request(`/api/students/${encodeURIComponent(email)}/notes/${isoDate}`, { method: 'DELETE' })

// --- Habitos ---
export const getHabits = (email) =>
  request(`/api/students/${encodeURIComponent(email)}/habitos`)

export const createHabit = (email, habit) =>
  request(`/api/students/${encodeURIComponent(email)}/habitos`, {
    method: 'POST',
    body: JSON.stringify(habit),
  })

export const updateHabit = (email, habitId, patch) =>
  request(`/api/students/${encodeURIComponent(email)}/habitos/${habitId}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })

export const deleteHabit = (email, habitId) =>
  request(`/api/students/${encodeURIComponent(email)}/habitos/${habitId}`, { method: 'DELETE' })
