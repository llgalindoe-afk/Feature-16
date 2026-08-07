import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../../store/authSlice';

function AdminRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = useSelector(selectIsAdmin);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}

export default AdminRoute;
