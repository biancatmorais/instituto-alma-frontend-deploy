import React from 'react';
import { useAuth } from '../context/TempAuthContext';
import { Navigate, useLocation } from 'react-router-dom';


function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation(); 

  
  if (!isAuthenticated || !user) {
  
    return <Navigate to="/portal" state={{ from: location }} replace />;
  }

  
  if (!allowedRoles.includes(user.role)) {
    
    return <Navigate to="/dashboard" replace />;
  }

 
  return children;
}

export default ProtectedRoute;