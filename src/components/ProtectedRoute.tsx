/**
 * ProtectedRoute - Role-based route protection
 * Redirects users based on their role and route requirements
 * 
 * FIXED: Simplified admin route protection - only checks adminSession
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleRoute, canAccessRoute } from '@/utils/roleRoutes';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
}

/**
 * ProtectedRoute component
 * - If no role specified: allows any authenticated user
 * - If requiredRole: only allows that specific role
 * - If allowedRoles: allows any role in the array
 * 
 * FIXED: Admin routes now use simple check - adminSession OR adminLoggedIn
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  allowedRoles 
}) => {
  const { userRole, user, adminLoggedIn, hydrated } = useAuth();
  const location = useLocation();

  // Wait for hydration to complete before checking routes
  // This prevents race conditions where localStorage hasn't been read yet
  if (!hydrated) {
    return null; // Or a loading spinner
  }

  // FIXED: Admin routes - ONLY allow if adminSession is true
  // Check both context state AND localStorage for reliability
  if (location.pathname.startsWith('/admin')) {
    const isAdminSession = 
      adminLoggedIn || 
      localStorage.getItem('adminSession') === 'true';
    
    if (!isAdminSession) {
      // Normal users CANNOT access admin routes - redirect to login
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    
    // Admin is logged in - allow access
    return <>{children}</>;
  }

  // Staff routes - check permissions
  if (location.pathname.startsWith('/staff')) {
    if (userRole === 'staff' || userRole === 'admin') {
      return <>{children}</>;
    }
    // Redirect to staff login if not authorized
    return <Navigate to="/staff/login" state={{ from: location }} replace />;
  }

  // Check role requirements (only for non-admin routes)
  if (requiredRole) {
    if (userRole !== requiredRole) {
      // Redirect to role's default route
      return <Navigate to={getRoleRoute(userRole)} replace />;
    }
  }

  if (allowedRoles) {
    if (!allowedRoles.includes(userRole)) {
      // Redirect to role's default route
      return <Navigate to={getRoleRoute(userRole)} replace />;
    }
  }

  // Check if user can access the route
  if (!canAccessRoute(location.pathname, userRole)) {
    return <Navigate to={getRoleRoute(userRole)} replace />;
  }

  return <>{children}</>;
};

/**
 * AdminRoute - Only allows admin, staff, or reviewer
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['admin', 'staff', 'reviewer']}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * StaffRoute - Only allows staff or admin
 */
export const StaffRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['staff', 'admin']}>
      {children}
    </ProtectedRoute>
  );
};

