import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PrivateRoute({ children }) {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}

export default PrivateRoute;
