import React, { Suspense, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { GeneralErrorBoundary, AdminErrorBoundary } from '@/components/common/ErrorBoundary';
import { AdminRoute, StaffRoute } from '@/components/ProtectedRoute';

// Pages - Lazy loaded for better performance
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const AboutPage = React.lazy(() => import('@/pages/AboutPage'));
const AgendaPage = React.lazy(() => import('@/pages/AgendaPage'));
const EcosystemPage = React.lazy(() => import('@/pages/EcosystemPage'));
const AttendeeRegistrationPage = React.lazy(() => import('@/pages/AttendeeRegistrationPage'));
const SignIn = React.lazy(() => import('@/pages/SignIn'));
const Register = React.lazy(() => import('@/pages/Register'));
const AdminLogin = React.lazy(() => import('@/pages/AdminLogin'));
const StaffLogin = React.lazy(() => import('@/pages/StaffLogin'));
const StaffDashboard = React.lazy(() => import('@/pages/StaffDashboard'));
const AdminDashboard = React.lazy(() => import('@/pages/AdminDashboard'));
const AdminPrintView = React.lazy(() => import('@/pages/AdminPrintView'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const CheckTicket = React.lazy(() => import('@/pages/CheckTicket'));

// Layout Components
import { PageLayout, PageTransition } from '@/layout';

// Loading Skeleton Component
const LoadingSkeleton: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className={`h-6 rounded ${
        theme === 'light' ? 'bg-gray-200' : 'bg-white/10'
      }`}></div>
      <div className={`h-6 rounded w-2/3 ${
        theme === 'light' ? 'bg-gray-200' : 'bg-white/10'
      }`}></div>
      <div className={`h-48 rounded ${
        theme === 'light' ? 'bg-gray-200' : 'bg-white/10'
      }`}></div>
    </div>
  );
};

// Legacy ProtectedAdminRoute - kept for backward compatibility
// Now uses the new ProtectedRoute component
const ProtectedAdminRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <AdminRoute>{children}</AdminRoute>;
};

// Router Component
const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Layout */}
        <Route 
          path="/" 
          element={
            <PageLayout>
              <PageTransition>
                <Suspense fallback={<LoadingSkeleton />}>
                  <HomePage />
                </Suspense>
              </PageTransition>
            </PageLayout>
          } 
        />
        <Route 
          path="/about" 
          element={
            <PageLayout>
              <PageTransition>
                <Suspense fallback={<LoadingSkeleton />}>
                  <AboutPage />
                </Suspense>
              </PageTransition>
            </PageLayout>
          } 
        />
        <Route 
          path="/agenda" 
          element={
            <PageLayout>
              <PageTransition>
                <Suspense fallback={<LoadingSkeleton />}>
                  <AgendaPage />
                </Suspense>
              </PageTransition>
            </PageLayout>
          } 
        />
        <Route 
          path="/ecosystem" 
          element={
            <PageLayout>
              <PageTransition>
                <Suspense fallback={<LoadingSkeleton />}>
                  <EcosystemPage />
                </Suspense>
              </PageTransition>
            </PageLayout>
          } 
        />
        
        {/* Attendee Registration Page - Standalone (no layout) */}
        <Route 
          path="/register-attendee" 
          element={
            <Suspense fallback={<LoadingSkeleton />}>
              <AttendeeRegistrationPage />
            </Suspense>
          } 
        />
        
        {/* Check Ticket Page - Standalone (no layout) */}
        <Route 
          path="/my-ticket" 
          element={
            <Suspense fallback={<LoadingSkeleton />}>
              <CheckTicket />
            </Suspense>
          } 
        />
        
        {/* Auth Routes - No Layout */}
        <Route 
          path="/signin" 
          element={
            <Suspense fallback={<LoadingSkeleton />}>
              <SignIn />
            </Suspense>
          } 
        />
        <Route 
          path="/register" 
          element={
            <Suspense fallback={<LoadingSkeleton />}>
              <Register />
            </Suspense>
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/login" 
          element={
            <Suspense fallback={<LoadingSkeleton />}>
              <AdminLogin />
            </Suspense>
          } 
        />
        <Route 
          path="/staff/login" 
          element={
            <Suspense fallback={<LoadingSkeleton />}>
              <StaffLogin />
            </Suspense>
          } 
        />
        <Route 
          path="/staff/dashboard" 
          element={
            <StaffRoute>
              <Suspense fallback={<LoadingSkeleton />}>
                <StaffDashboard />
              </Suspense>
            </StaffRoute>
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedAdminRoute>
              <AdminErrorBoundary>
                <Suspense fallback={<LoadingSkeleton />}>
                  <AdminDashboard />
                </Suspense>
              </AdminErrorBoundary>
            </ProtectedAdminRoute>
          } 
        />
        <Route 
          path="/admin/print" 
          element={
            <ProtectedAdminRoute>
              <Suspense fallback={<LoadingSkeleton />}>
                <AdminPrintView />
              </Suspense>
            </ProtectedAdminRoute>
          } 
        />
        
        {/* 404 Not Found */}
        <Route 
          path="/404" 
          element={
            <PageLayout>
              <PageTransition>
                <Suspense fallback={<LoadingSkeleton />}>
                  <NotFound />
                </Suspense>
              </PageTransition>
            </PageLayout>
          } 
        />
        
        {/* Catch all - redirect to 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

// Main App Wrapper with Providers
const AppWithProviders: React.FC = () => {
  return (
    <GeneralErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </GeneralErrorBoundary>
  );
};

export default AppWithProviders;

