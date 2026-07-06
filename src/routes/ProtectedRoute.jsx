import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ currentUser, allowedRoles }) {
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
