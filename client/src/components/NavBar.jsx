import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <header className="site-header">
      <nav className="nav" aria-label="Main navigation">
        <Link to="/" className="brand">Active Era</Link>

        <ul className="nav-links">
          <li><NavLink to="/" end>Home</NavLink></li>

          {user ? (
            <>
              <li><NavLink to="/dashboard">Dashboard</NavLink></li>
              <li><NavLink to="/workouts">Workouts</NavLink></li>
              <li><NavLink to="/sleep">Sleep</NavLink></li>
              <li><NavLink to="/food">Food</NavLink></li>
              <li><NavLink to="/goals">Goals</NavLink></li>
              {user.role === 'admin' && <li><NavLink to="/admin/users">Users</NavLink></li>}
              <li><button className="link-button" onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><NavLink to="/login">Login</NavLink></li>
              <li><NavLink to="/register">Register</NavLink></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}
