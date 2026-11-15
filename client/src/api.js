import axios from 'axios'

// All requests go through this one Axios instance.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Attach the JWT to every request as: Authorization: Bearer <token>
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If the token is missing or expired (401), clear it and send the user to Login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const onAuthPage = ['/login', '/register'].includes(window.location.pathname)
    if (error.response?.status === 401 && !onAuthPage) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Pulls a readable message out of an error from the backend.
export function errorMessage(error) {
  const data = error.response?.data
  if (error.response?.status === 403) return 'You do not have permission to do that.'
  return data?.message || data?.error || error.message || 'Something went wrong.'
}

// The list routes might return an array or an object holding the array.
export function asList(data) {
  if (Array.isArray(data)) return data
  return data?.data || data?.items || []
}

export default api
