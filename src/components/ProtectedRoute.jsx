import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ProtectedRoute({ rolesPermitidos, children, redirectTo = '/' }) {
  const usuario = useSelector((s) => s.auth.usuario)
  if (!usuario) return <Navigate to="/login" replace />
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.role)) return <Navigate to={redirectTo} replace />
  return children
}

export default ProtectedRoute
