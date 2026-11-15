import { useEffect, useState } from 'react'
import api, { asList, errorMessage } from '../api.js'

// Turns a saved record into the values the form inputs need.
function toFormValues(fields, record = {}) {
  const values = {}
  fields.forEach((field) => {
    if (field.type === 'date') {
      values[field.name] = record[field.name] ? String(record[field.name]).slice(0, 10) : ''
    } else {
      values[field.name] = record[field.name] ?? field.defaultValue ?? ''
    }
  })
  return values
}

// Turns form values into the body we send to the API.
function toRequestBody(fields, values) {
  const body = {}
  fields.forEach((field) => {
    const value = values[field.name]
    if (value === '' || value === undefined) return
    body[field.name] = field.type === 'number' ? Number(value) : value
  })
  return body
}

function showValue(key, value) {
  if (value === undefined || value === null || value === '') return '-'
  if (key === 'date' || key === 'startDate' || key === 'endDate') {
    return new Date(value).toLocaleDateString()
  }
  return value
}

export default function RecordPage({ config }) {
  const { title, singular, endpoint, fields, columns, totalOf } = config

  const [items, setItems] = useState([])
  const [formData, setFormData] = useState(toFormValues(fields))
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadItems() {
    try {
      const res = await api.get(endpoint)
      setItems(asList(res.data))
      setError('')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  // Reload whenever the config changes (switching between Workouts, Sleep, etc.)
  useEffect(() => {
    setLoading(true)
    setEditingId(null)
    setFormData(toFormValues(fields))
    loadItems()
  }, [endpoint])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  function startEdit(item) {
    setEditingId(item._id)
    setFormData(toFormValues(fields, item))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setFormData(toFormValues(fields))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    const body = toRequestBody(fields, formData)
    try {
      if (editingId) {
        await api.put(`${endpoint}/${editingId}`, body)
      } else {
        await api.post(endpoint, body)
      }
      cancelEdit()
      loadItems()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(`Delete this ${singular}?`)) return
    try {
      await api.delete(`${endpoint}/${id}`)
      loadItems()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const total = totalOf ? items.reduce((sum, item) => sum + (item[totalOf] || 0), 0) : null

  return (
    <section className="section">
      <h1>{title}</h1>

      {error && <p className="error" role="alert">{error}</p>}

      <form className="card form" onSubmit={handleSubmit}>
        <h2>{editingId ? `Edit ${singular}` : `Add ${singular}`}</h2>

        <div className="field-grid">
          {fields.map((field) => (
            <label key={field.name}>
              {field.label}

              {field.type === 'select' ? (
                <select name={field.name} value={formData[field.name]} onChange={handleChange} required={field.required}>
                  {!field.defaultValue && <option value="">Choose...</option>}
                  {field.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  rows="3"
                  value={formData[field.name]}
                  onChange={handleChange}
                  maxLength={field.maxLength}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  placeholder={field.placeholder}
                />
              )}
            </label>
          ))}
        </div>

        <div className="button-row">
          <button className="button primary" type="submit">
            {editingId ? 'Save changes' : `Add ${singular}`}
          </button>
          {editingId && (
            <button className="button" type="button" onClick={cancelEdit}>Cancel</button>
          )}
        </div>
      </form>

      <h2>Your {title.toLowerCase()}</h2>
      {total !== null && <p className="lead">Total {totalOf}: {total}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>Nothing here yet. Add your first {singular} above.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {columns.map((key) => {
                  const field = fields.find((f) => f.name === key)
                  return <th key={key}>{field ? field.label : key}</th>
                })}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  {columns.map((key) => (
                    <td key={key}>{showValue(key, item[key])}</td>
                  ))}
                  <td className="actions">
                    <button className="button small" onClick={() => startEdit(item)}>Edit</button>
                    <button className="button small danger" onClick={() => handleDelete(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
