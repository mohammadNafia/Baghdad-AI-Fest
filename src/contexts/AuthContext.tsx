/**
 * AuthContext - Authentication context with flexible role handling
 * Uses roleUtils for normalization and validation
 * 
 * FIXED: Added hydration guard and proper async adminLogin
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { normalizeRole } from '@/utils/roleUtils';
import type { User, UserRole } from '@/types';
import { validateStaffCredentials } from '@/services/staffService';

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  adminLoggedIn: boolean;
  token: string | null;
  sessionExpiry: number | null;
  hydrated: boolean;
  login: (userData: Partial<User> & { email: string; name: string }, token?: string, expiresIn?: number) => void;
  logout: () => void;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  staffLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
  checkSession: () => boolean;
  refreshToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Hydration state - prevents rendering before localStorage is read
  const [hydrated, setHydrated] = useState<boolean>(false);

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>('guest');

  // Hydrate state from localStorage on mount
  useEffect(() => {
    try {
      // Read all localStorage values first
      const adminSession = localStorage.getItem('adminSession') === 'true';
      const userSession = localStorage.getItem('userSession');
      const authToken = localStorage.getItem('authToken');
      const expiry = localStorage.getItem('sessionExpiry');
      const storedUserRole = localStorage.getItem('userRole');

      // Determine initial state
      if (adminSession) {
        // Admin session takes precedence
        setAdminLoggedIn(true);
        setUserRole('admin');
        setUser(null); // Clear any user session
        if (authToken) setToken(authToken);
        if (expiry) setSessionExpiry(parseInt(expiry, 10));
      } else if (userSession) {
        // Regular user session
        try {
          const parsed = JSON.parse(userSession);
          const normalizedRole = normalizeRole(parsed.role || storedUserRole, 'user');
          
          setUser({
            ...parsed,
            role: normalizedRole,
          });
          setUserRole(normalizedRole);
          if (authToken) setToken(authToken);
          if (expiry) setSessionExpiry(parseInt(expiry, 10));
        } catch (error) {
          console.error('Error parsing user session:', error);
          setUser(null);
          setUserRole('guest');
        }
      } else {
        // No session - check if there's a stored role (shouldn't happen, but handle it)
        if (storedUserRole) {
          const normalizedRole = normalizeRole(storedUserRole, 'guest');
          setUserRole(normalizedRole);
        } else {
          setUserRole('guest');
        }
        setUser(null);
      }
    } catch (error) {
      console.error('Error hydrating auth state:', error);
      setUser(null);
      setAdminLoggedIn(false);
      setUserRole('guest');
    } finally {
      // Mark as hydrated after reading localStorage
      setHydrated(true);
    }
  }, []); // Only run once on mount

  // Session expiry check
  useEffect(() => {
    const checkExpiry = () => {
      if (sessionExpiry && Date.now() >= sessionExpiry) {
        logout();
      }
    };

    const interval = setInterval(checkExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [sessionExpiry]);

  // Auto-logout on idle
  useEffect(() => {
    if (!user && !adminLoggedIn) return;

    let idleTimer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        logout();
      }, IDLE_TIMEOUT);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetIdleTimer, { passive: true });
    });

    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      events.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [user, adminLoggedIn]);

  /**
   * Login function with flexible role handling
   * Automatically normalizes role if provided (handles typos like "rolo")
   * FIXED: Clears admin session and sets userRole in localStorage
   */
  const login = (
    userData: Partial<User> & { email: string; name: string },
    authToken?: string,
    expiresIn: number = SESSION_DURATION
  ) => {
    // Normalize role if provided, default to 'user'
    const normalizedRole = userData.role 
      ? normalizeRole(userData.role, 'user')
      : 'user';

    const userWithRole: User = {
      id: userData.id || Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: normalizedRole, // Always use normalized role
      avatar: userData.avatar,
    };

    const authTokenValue = authToken || `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiry = Date.now() + expiresIn;

    // STEP 1: Clear any admin session first (user and admin cannot be logged in simultaneously)
    localStorage.removeItem('adminSession');
    setAdminLoggedIn(false);

    // STEP 2: Set localStorage FIRST (synchronous, immediate)
    localStorage.setItem('userSession', JSON.stringify(userWithRole));
    localStorage.setItem('authToken', authTokenValue);
    localStorage.setItem('userRole', normalizedRole);
    localStorage.setItem('sessionExpiry', expiry.toString());

    // STEP 3: Update React state synchronously
    setUser(userWithRole);
    setUserRole(normalizedRole);
    setToken(authTokenValue);
    setSessionExpiry(expiry);
  };

  const logout = () => {
    // Remove all session keys from localStorage
    localStorage.removeItem('userSession');
    localStorage.removeItem('adminSession');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('sessionExpiry');
    
    // Reset React state
    setUser(null);
    setAdminLoggedIn(false);
    setUserRole('guest');
    setToken(null);
    setSessionExpiry(null);
  };

  /**
   * Admin login - Returns Promise that resolves after all state is updated
   * FIXED: Now async and ensures localStorage + React state are synchronized
   */
  const adminLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Admin credentials
    const ADMIN_EMAIL = 'admin@gmail.com';
    const ADMIN_PASSWORD = 'admin123';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const authToken = `admin_${Date.now()}`;
      const expiry = Date.now() + SESSION_DURATION;
      
      // STEP 1: Set localStorage FIRST (synchronous, immediate)
      // This is critical - localStorage is checked by ProtectedRoute
      localStorage.setItem('adminSession', 'true');
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('sessionExpiry', expiry.toString());
      
      // STEP 2: Remove any conflicting user session
      localStorage.removeItem('userSession');
      
      // STEP 3: Update React state synchronously
      setUser(null);
      setAdminLoggedIn(true);
      setUserRole('admin');
      setToken(authToken);
      setSessionExpiry(expiry);
      
      // STEP 4: Return resolved Promise
      // localStorage is already set, so ProtectedRoute will work immediately
      // The Promise allows AdminLogin to use await
      return Promise.resolve({ success: true });
    } else {
      return Promise.resolve({ success: false, error: 'Invalid credentials' });
    }
  };

  /**
   * Staff login
   * Uses staffService to validate credentials
   */
  const staffLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const result = validateStaffCredentials(email, password);
    
    if (result.success && result.staff) {
      // Create user object from staff member
      const staffUser = {
        email: result.staff.email,
        name: result.staff.name,
        role: 'staff' as UserRole,
        id: result.staff.id,
        permissions: result.staff.permissions
      };
      
      // Use standard login function to set session
      login(staffUser);
      
      return Promise.resolve({ success: true });
    } else {
      return Promise.resolve({ success: false, error: result.error || 'Invalid credentials' });
    }
  };

  const adminLogout = () => {
    // Remove all session keys
    localStorage.removeItem('adminSession');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('sessionExpiry');
    
    // Reset React state
    setAdminLoggedIn(false);
    setUserRole('guest');
    setToken(null);
    setSessionExpiry(null);
    setUser(null);
  };

  const checkSession = (): boolean => {
    if (!sessionExpiry) return false;
    const isValid = Date.now() < sessionExpiry;
    if (!isValid) {
      logout();
    }
    return isValid;
  };

  const refreshToken = () => {
    if (sessionExpiry && Date.now() < sessionExpiry) {
      const newExpiry = Date.now() + SESSION_DURATION;
      setSessionExpiry(newExpiry);
      localStorage.setItem('sessionExpiry', newExpiry.toString());
    }
  };

  // Don't render children until hydration is complete
  // This prevents race conditions with ProtectedRoute
  if (!hydrated) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        adminLoggedIn,
        token,
        sessionExpiry,
        hydrated,
        login,
        logout,
        adminLogin,
        staffLogin,
        adminLogout,
        checkSession,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

