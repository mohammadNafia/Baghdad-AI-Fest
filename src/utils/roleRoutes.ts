/**
 * Role-based Routing Utilities
 * Maps user roles to their default routes after login
 */

import type { UserRole } from '@/types';

/**
 * Role to route mapping
 * Defines where each role should be redirected after login
 */
export const ROLE_ROUTES: Record<UserRole, string> = {
  guest: '/',
  user: '/',
  reviewer: '/admin/dashboard', // Reviewers go to admin dashboard
  staff: '/staff/dashboard',    // Staff go to staff dashboard
  admin: '/admin/dashboard',    // Admins go to admin dashboard
};

/**
 * Gets the default route for a user role
 * 
 * @param role - The user's role
 * @returns The route path for that role
 * 
 * @example
 * getRoleRoute('admin') // Returns '/admin/dashboard'
 * getRoleRoute('user')  // Returns '/'
 */
export function getRoleRoute(role: UserRole): string {
  return ROLE_ROUTES[role] || ROLE_ROUTES.guest;
}

/**
 * Checks if a route requires authentication
 * 
 * @param path - The route path
 * @returns True if route requires auth
 */
export function requiresAuth(path: string): boolean {
  return path.startsWith('/admin') || path.startsWith('/profile');
}

/**
 * Checks if a route requires a specific role
 * 
 * @param path - The route path
 * @param role - The user's role
 * @returns True if user can access the route
 */
export function canAccessRoute(path: string, role: UserRole): boolean {
  // Admin routes require admin, staff, or reviewer
  if (path.startsWith('/admin')) {
    return role === 'admin' || role === 'staff' || role === 'reviewer';
  }
  
  // Staff routes require staff role
  if (path.startsWith('/staff')) {
    return role === 'staff' || role === 'admin';
  }
  
  // Public routes accessible to all
  return true;
}

