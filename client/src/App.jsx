import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RecordPage from './components/RecordPage.jsx'
import { workoutConfig, sleepConfig, mealConfig, goalConfig } from './recordConfigs.js'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminUsers from './pages/AdminUsers.jsx'

export default function App() {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/workouts" element={<ProtectedRoute><RecordPage config={workoutConfig} /></ProtectedRoute>} />
          <Route path="/sleep" element={<ProtectedRoute><RecordPage config={sleepConfig} /></ProtectedRoute>} />
          <Route path="/food" element={<ProtectedRoute><RecordPage config={mealConfig} /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><RecordPage config={goalConfig} /></ProtectedRoute>} />

          <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </>
  )
}
