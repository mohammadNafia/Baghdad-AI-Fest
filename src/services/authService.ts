/**
 * Authentication Service - Supabase Auth Integration
 * 
 * Handles:
 * - Admin login with role verification
 * - User authentication
 * - Profile management
 */

import { supabase } from '@/lib/SupabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'user' | 'reviewer';
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResult {
  success: boolean;
  user?: SupabaseUser;
  profile?: UserProfile;
  error?: string;
}

class AuthService {
  /**
   * Admin Login - Authenticates and verifies admin role
   * 
   * 1. Signs in with Supabase Auth
   * 2. Fetches user profile from 'users' table
   * 3. Verifies role === 'admin'
   * 4. Signs out if not admin
   */
  async adminLogin(email: string, password: string): Promise<AuthResult> {
    try {
      // Step 1: Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Auth error:', authError);
        return { 
          success: false, 
          error: authError.message || 'Invalid email or password' 
        };
      }

      if (!authData.user) {
        return { 
          success: false, 
          error: 'Authentication failed - no user returned' 
        };
      }

      // Step 2: Fetch user profile from 'users' table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        // Sign out since we can't verify role
        await supabase.auth.signOut();
        return { 
          success: false, 
          error: 'Failed to fetch user profile' 
        };
      }

      // Step 3: Verify admin role
      if (profile.role !== 'admin') {
        console.warn('Non-admin user attempted admin login:', email);
        // Sign out unauthorized user immediately
        await supabase.auth.signOut();
        return { 
          success: false, 
          error: 'Unauthorized: Admin access required' 
        };
      }

      // Step 4: Success - return user and profile
      console.log('Admin login successful:', email);
      return {
        success: true,
        user: authData.user,
        profile: {
          id: profile.id,
          email: profile.email,
          name: profile.name || profile.email.split('@')[0],
          role: profile.role,
          avatar_url: profile.avatar_url,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        },
      };
    } catch (error) {
      console.error('Admin login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Staff Login - Authenticates and verifies staff or admin role
   */
  async staffLogin(email: string, password: string): Promise<AuthResult> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Authentication failed' };
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        await supabase.auth.signOut();
        return { success: false, error: 'Failed to fetch user profile' };
      }

      // Staff or admin can access staff dashboard
      if (profile.role !== 'staff' && profile.role !== 'admin') {
        await supabase.auth.signOut();
        return { success: false, error: 'Unauthorized: Staff access required' };
      }

      return {
        success: true,
        user: authData.user,
        profile: {
          id: profile.id,
          email: profile.email,
          name: profile.name || profile.email.split('@')[0],
          role: profile.role,
          avatar_url: profile.avatar_url,
        },
      };
    } catch (error) {
      console.error('Staff login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Regular user login
   */
  async userLogin(email: string, password: string): Promise<AuthResult> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Authentication failed' };
      }

      // Try to fetch profile, create one if doesn't exist
      let { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email,
            name: authData.user.email?.split('@')[0] || 'User',
            role: 'user',
          })
          .select()
          .single();

        if (createError) {
          console.error('Failed to create profile:', createError);
        } else {
          profile = newProfile;
        }
      }

      return {
        success: true,
        user: authData.user,
        profile: profile ? {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role || 'user',
          avatar_url: profile.avatar_url,
        } : undefined,
      };
    } catch (error) {
      console.error('User login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sign out',
      };
    }
  }

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        return { session: null, error: error.message };
      }
      return { session, error: null };
    } catch (error) {
      return { session: null, error: 'Failed to get session' };
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      return profile ? {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        avatar_url: profile.avatar_url,
      } : null;
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      return null;
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
