import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from './Loader';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-bg flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader size="lg" text="Verifying Security Clearance & Cryptographic Tokens..." />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/?auth=login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
