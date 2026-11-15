import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { errorMessage } from '../api.js'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      await register(formData.name, formData.email, formData.password)
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <section className="section narrow">
      <h1>Register</h1>
      {error && <p className="error" role="alert">{error}</p>}

      <form className="card form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={formData.name} onChange={handleChange} required autoComplete="name" />
        </label>
        <label>
          Email address
          <input type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" />
        </label>
        <label>
          Password
          <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} autoComplete="new-password" />
        </label>
        <label>
          Confirm password
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required autoComplete="new-password" />
        </label>
        <button className="button primary" type="submit">Register</button>
      </form>

      <p>Already have an account? <Link to="/login">Login</Link></p>
    </section>
  )
}
