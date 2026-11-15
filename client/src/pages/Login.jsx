import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { errorMessage } from '../api.js'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    try {
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <section className="section narrow">
      <h1>Login</h1>

      {state?.registered && <p className="notice" role="status">Account created. Please log in.</p>}
      {error && <p className="error" role="alert">{error}</p>}

      <form className="card form" onSubmit={handleSubmit}>
        <label>
          Email address
          <input type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" />
        </label>
        <label>
          Password
          <input type="password" name="password" value={formData.password} onChange={handleChange} required autoComplete="current-password" />
        </label>
        <button className="button primary" type="submit">Login</button>
      </form>

      <p>New here? <Link to="/register">Register</Link></p>
    </section>
  )
}
