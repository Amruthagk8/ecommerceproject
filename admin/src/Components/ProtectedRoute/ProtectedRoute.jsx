import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const authToken = localStorage.getItem('auth-token');

  return authToken ? <Component {...rest} /> : <Navigate to="/" />;
};

export default ProtectedRoute;
