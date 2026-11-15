import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { asList, errorMessage } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

function sum(list, key) {
  return list.reduce((total, item) => total + (item[key] || 0), 0)
}

function newestFirst(list) {
  return [...list].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
}

// Basic Release 1 dashboard: it uses the four list APIs we already have.
// The real /api/dashboard endpoint is planned for Release 2.
export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState({ workouts: [], sleep: [], meals: [], goals: [] })
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [workouts, sleep, meals, goals] = await Promise.all([
          api.get('/workouts'),
          api.get('/sleep'),
          api.get('/meals'),
          api.get('/goals'),
        ])
        setData({
          workouts: asList(workouts.data),
          sleep: asList(sleep.data),
          meals: asList(meals.data),
          goals: asList(goals.data),
        })
      } catch (err) {
        setError(errorMessage(err))
      }
    }
    load()
  }, [])

  const consumed = sum(data.meals, 'calories')
  const burned = sum(data.workouts, 'caloriesBurned')
  const activeGoals = data.goals.filter((goal) => goal.status === 'active')

  return (
    <section className="section">
      <h1>Welcome, {user?.name}</h1>
      {error && <p className="error" role="alert">{error}</p>}

      <div className="card-grid">
        <article className="card">
          <h2>Calories</h2>
          <p>Consumed: {consumed}</p>
          <p>Burned: {burned}</p>
          <p><strong>Balance: {consumed - burned}</strong></p>
        </article>

        <article className="card">
          <h2>Recent workouts</h2>
          {data.workouts.length === 0 ? <p>No workouts yet.</p> : (
            <ul>
              {newestFirst(data.workouts).map((w) => (
                <li key={w._id}>{new Date(w.date).toLocaleDateString()}: {w.exerciseType}, {w.durationMinutes} min</li>
              ))}
            </ul>
          )}
          <Link to="/workouts">Manage workouts</Link>
        </article>

        <article className="card">
          <h2>Recent sleep</h2>
          {data.sleep.length === 0 ? <p>No sleep records yet.</p> : (
            <ul>
              {newestFirst(data.sleep).map((s) => (
                <li key={s._id}>{new Date(s.date).toLocaleDateString()}: {s.hoursSlept} hours</li>
              ))}
            </ul>
          )}
          <Link to="/sleep">Manage sleep</Link>
        </article>

        <article className="card">
          <h2>Active goals</h2>
          {activeGoals.length === 0 ? <p>No active goals.</p> : (
            <ul>
              {activeGoals.map((g) => (
                <li key={g._id}>{g.title} ({g.targetValue} {g.unit})</li>
              ))}
            </ul>
          )}
          <Link to="/goals">Manage goals</Link>
        </article>
      </div>
    </section>
  )
}
