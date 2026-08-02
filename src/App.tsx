import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components'
import { AuthProvider } from './context/AuthContext'
import { AdminHome } from './routes/admin/AdminHome'
import { DevKit } from './routes/dev/DevKit'
import { Login } from './routes/Login'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { TenantHome } from './routes/tenant/TenantHome'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* TODO: remove before shipping — see DevKit.tsx */}
        {import.meta.env.DEV && <Route path="/dev/kit" element={<DevKit />} />}

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
        </Route>

        <Route
          path="/tenant"
          element={
            <ProtectedRoute requiredRole="tenant">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TenantHome />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
