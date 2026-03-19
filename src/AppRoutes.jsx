import { Routes, Route } from 'react-router-dom'
import Vacancies from './pages/Vacancies'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './routes/ProtectedRoutes'
import MisPostulaciones from './pages/MisPostulaciones'
import AdminDashboard from './pages/AdminDashboard'
import RegistrarEmpresa from './pages/RegistrarEmpresa'
import Registro from './pages/Registro'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Vacancies />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/mis-postulaciones" element={
        <ProtectedRoute><MisPostulaciones /></ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/registro-empresa" element={
        <RegistrarEmpresa />
      } />
      <Route path="/registro" element={
        <Registro />
      } />
    </Routes>
  )
}
