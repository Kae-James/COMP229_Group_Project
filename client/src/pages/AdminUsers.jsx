import { useEffect, useState } from 'react'
import api, { asList, errorMessage } from '../api.js'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', role: 'user' })
  const [error, setError] = useState('')

  async function loadUsers() {
    try {
      const res = await api.get('/users')
      setUsers(asList(res.data))
      setError('')
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  function startEdit(user) {
    setEditingId(user._id)
    setFormData({ name: user.name, email: user.email, role: user.role })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await api.put(`/users/${editingId}`, formData)
      setEditingId(null)
      loadUsers()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this user account?')) return
    try {
      await api.delete(`/users/${id}`)
      loadUsers()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <section className="section">
      <h1>Manage users</h1>
      {error && <p className="error" role="alert">{error}</p>}

      {editingId && (
        <form className="card form" onSubmit={handleSubmit}>
          <h2>Edit user</h2>
          <div className="field-grid">
            <label>
              Name
              <input name="name" value={formData.name} onChange={handleChange} required />
            </label>
            <label>
              Email
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </label>
            <label>
              Role
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </label>
          </div>
          <div className="button-row">
            <button className="button primary" type="submit">Save changes</button>
            <button className="button" type="button" onClick={() => setEditingId(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Date joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.created || u.createdAt ? new Date(u.created || u.createdAt).toLocaleDateString() : '-'}</td>
                <td className="actions">
                  <button className="button small" onClick={() => startEdit(u)}>Edit</button>
                  <button className="button small danger" onClick={() => handleDelete(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
