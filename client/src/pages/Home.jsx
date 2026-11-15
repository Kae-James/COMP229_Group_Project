import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  const { user } = useAuth()

  return (
    <section className="hero">
      <div className="hero-inner">
        <div>
          <span className="hero-kicker">Welcome to Active Era</span>
          <h1>Your fitness, all in one place.</h1>
          <p className="hero-sub">
            Track your workouts, sleep and meals, set goals and see how far you have come.
          </p>
          <div className="button-row">
            {user ? (
              <Link className="button primary" to="/dashboard">Go to dashboard</Link>
            ) : (
              <>
                <Link className="button primary" to="/register">Get started</Link>
                <Link className="button" to="/login">Login</Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-panel" aria-hidden="true">
          <h2>A day in Active Era</h2>
          <div className="panel-row"><span>Morning run</span><span>35 min</span></div>
          <div className="panel-row"><span>Sleep last night</span><span>7.5 hrs</span></div>
          <div className="panel-row"><span>Lunch</span><span>520 cal</span></div>
          <div className="panel-row"><span>Weekly goal</span><span>3 of 4</span></div>
        </div>
      </div>
    </section>
  )
}
