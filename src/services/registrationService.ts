/**
 * Registration Service - Supabase Database Integration
 * 
 * CRITICAL: Table names MUST match Supabase exactly:
 * - attendees
 * - speakers  
 * - partners
 */

import { supabase, isSupabaseConfigured } from '@/lib/SupabaseClient';
import type { AttendeeFormData, SpeakerFormData, PartnerFormData } from '@/types';

export interface RegistrationResult {
  success: boolean;
  data?: any;
  error?: string;
}

class RegistrationService {
  /**
   * Get total attendee count (all statuses)
   */
  async getTotalAttendeeCount(): Promise<{ success: boolean; count?: number; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
        return { success: true, count: 0 };
      }

      const { count, error } = await supabase
        .from('attendees')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('[RegistrationService] Error getting total count:', error);
        return { success: true, count: 0 };
      }

      return { success: true, count: count || 0 };
    } catch (error) {
      console.error('[RegistrationService] Unexpected error getting count:', error);
      return { success: true, count: 0 };
    }
  }

  /**
   * Submit attendee registration to Supabase
   * Checks capacity (250) before allowing registration
   */
  async submitAttendee(formData: Partial<AttendeeFormData>): Promise<RegistrationResult> {
    try {
      if (!isSupabaseConfigured()) {
        console.error('[RegistrationService] Supabase not configured');
        return { success: false, error: 'Database not configured' };
      }

      // Check current attendee count before allowing registration
      const MAX_CAPACITY = 250;
      const countResult = await this.getTotalAttendeeCount();
      
      if (!countResult.success || countResult.count === undefined) {
        console.error('[RegistrationService] Failed to get attendee count');
        return { success: false, error: 'Failed to check registration capacity' };
      }

      if (countResult.count >= MAX_CAPACITY) {
        console.log('[RegistrationService] Registration closed: Capacity reached', countResult.count);
        return { 
          success: false, 
          error: 'Registration Closed: Capacity Reached.' 
        };
      }

      console.log('[RegistrationService] Submitting attendee:', formData);
      
      const { data, error } = await supabase
        .from('attendees')  // CORRECT TABLE NAME
        .insert({
          name: formData.name,
          email: formData.email?.toLowerCase().trim(),
          phone: formData.phone,
          age: formData.age,
          occupation: formData.occupation,
          organization: formData.organization || formData.institution || '',
          motivation: formData.motivation,
          newsletter: formData.newsletter || false,
          status: 'pending',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('[RegistrationService] Supabase insert error:', error);
        
        // Handle duplicate email error
        if (error.code === '23505') {
          return { 
            success: false, 
            error: 'This email is already registered' 
          };
        }
        
        return { 
          success: false, 
          error: error.message || 'Failed to submit registration' 
        };
      }

      console.log('[RegistrationService] Registration successful:', data);
      return { success: true, data };
    } catch (error) {
      console.error('[RegistrationService] Unexpected error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Submit speaker application to Supabase
   */
  async submitSpeaker(formData: Partial<SpeakerFormData>): Promise<RegistrationResult> {
    try {
      if (!isSupabaseConfigured()) {
        console.error('[RegistrationService] Supabase not configured');
        return { success: false, error: 'Database not configured' };
      }

      console.log('[RegistrationService] Submitting speaker:', formData);
      
      const { data, error } = await supabase
        .from('speakers')  // CORRECT TABLE NAME
        .insert({
          name: formData.name,
          email: formData.email?.toLowerCase().trim(),
          phone: formData.phone,
          occupation: formData.occupation,
          institution: formData.institution || formData.organization || '',
          skills: formData.skills,
          experience: formData.experience,
          topics: formData.topics,
          achievements: formData.achievements,
          status: 'pending',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('[RegistrationService] Speaker submission error:', error);
        return { success: false, error: error.message };
      }

      console.log('[RegistrationService] Speaker submission successful:', data);
      return { success: true, data };
    } catch (error) {
      console.error('[RegistrationService] Unexpected error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Submit partner application to Supabase
   */
  async submitPartner(formData: Partial<PartnerFormData>): Promise<RegistrationResult> {
    try {
      if (!isSupabaseConfigured()) {
        console.error('[RegistrationService] Supabase not configured');
        return { success: false, error: 'Database not configured' };
      }

      console.log('[RegistrationService] Submitting partner:', formData);
      
      const { data, error } = await supabase
        .from('partners')  // CORRECT TABLE NAME
        .insert({
          organization: formData.organization,
          email: formData.email?.toLowerCase().trim(),
          category: formData.category,
          requirements: formData.requirements,
          status: 'pending',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('[RegistrationService] Partner submission error:', error);
        return { success: false, error: error.message };
      }

      console.log('[RegistrationService] Partner submission successful:', data);
      return { success: true, data };
    } catch (error) {
      console.error('[RegistrationService] Unexpected error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  /**
   * Get all attendee registrations (for admin dashboard)
   * Returns empty array on error for graceful degradation
   */
  async getAllAttendees(): Promise<RegistrationResult> {
    try {
      if (!isSupabaseConfigured()) {
        console.warn('[RegistrationService] Supabase not configured, returning empty array');
        return { success: true, data: [] };
      }

      console.log('[RegistrationService] Fetching all attendees...');
      
      const { data, error } = await supabase
        .from('attendees')  // CORRECT TABLE NAME
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[RegistrationService] Error fetching attendees:', error);
        // Return empty array instead of failing - graceful degradation
        return { success: true, data: [] };
      }

      console.log('[RegistrationService] Fetched attendees:', data?.length || 0);
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('[RegistrationService] Unexpected error fetching attendees:', error);
      return { success: true, data: [] };
    }
  }

  /**
   * Get all speaker applications (for admin dashboard)
   * Returns empty array on error for graceful degradation
   */
  async getAllSpeakers(): Promise<RegistrationResult> {
    try {
      if (!isSupabaseConfigured()) {
        console.warn('[RegistrationService] Supabase not configured, returning empty array');
        return { success: true, data: [] };
      }

      console.log('[RegistrationService] Fetching all speakers...');
      
      const { data, error } = await supabase
        .from('speakers')  // CORRECT TABLE NAME
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[RegistrationService] Error fetching speakers:', error);
        return { success: true, data: [] };
      }

      console.log('[RegistrationService] Fetched speakers:', data?.length || 0);
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('[RegistrationService] Unexpected error fetching speakers:', error);
      return { success: true, data: [] };
    }
  }

  /**
   * Get all partner applications (for admin dashboard)
   * Returns empty array on error for graceful degradation
   */
  async getAllPartners(): Promise<RegistrationResult> {
    try {
      if (!isSupabaseConfigured()) {
        console.warn('[RegistrationService] Supabase not configured, returning empty array');
        return { success: true, data: [] };
      }

      console.log('[RegistrationService] Fetching all partners...');
      
      const { data, error } = await supabase
        .from('partners')  // CORRECT TABLE NAME
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[RegistrationService] Error fetching partners:', error);
        return { success: true, data: [] };
      }

      console.log('[RegistrationService] Fetched partners:', data?.length || 0);
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('[RegistrationService] Unexpected error fetching partners:', error);
      return { success: true, data: [] };
    }
  }

  /**
   * Update attendee status
   */
  async updateAttendeeStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<RegistrationResult> {
    try {
      if (!isSupabaseConfigured()) {
        console.error('[RegistrationService] Supabase not configured');
        return { success: false, error: 'Database not configured' };
      }

      console.log('[RegistrationService] Updating attendee status:', id, status);
      
      const { data, error } = await supabase
        .from('attendees')  // CORRECT TABLE NAME
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[RegistrationService] Error updating status:', error);
        return { success: false, error: error.message };
      }

      console.log('[RegistrationService] Status updated successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('[RegistrationService] Unexpected error updating status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update status',
      };
    }
  }

  /**
   * Get approved attendee count (for capacity tracking)
   */
  async getApprovedCount(): Promise<{ success: boolean; count?: number; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
        return { success: true, count: 0 };
      }

      const { count, error } = await supabase
        .from('attendees')  // CORRECT TABLE NAME
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      if (error) {
        console.error('[RegistrationService] Error getting approved count:', error);
        return { success: true, count: 0 };
      }

      return { success: true, count: count || 0 };
    } catch (error) {
      console.error('[RegistrationService] Unexpected error getting count:', error);
      return { success: true, count: 0 };
    }
  }

  /**
   * Search attendee by email (for ticket lookup)
   */
  async findAttendeeByEmail(email: string): Promise<RegistrationResult> {
    try {
      if (!isSupabaseConfigured()) {
        console.error('[RegistrationService] Supabase not configured');
        return { success: false, error: 'Database not configured' };
      }

      console.log('[RegistrationService] Searching for attendee:', email);
      
      const { data, error } = await supabase
        .from('attendees')  // CORRECT TABLE NAME
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('[RegistrationService] No registration found for:', email);
          return { success: false, error: 'No registration found with this email' };
        }
        console.error('[RegistrationService] Error finding attendee:', error);
        return { success: false, error: error.message };
      }

      console.log('[RegistrationService] Found attendee:', data);
      return { success: true, data };
    } catch (error) {
      console.error('[RegistrationService] Unexpected error finding attendee:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to find registration',
      };
    }
  }
}

export const registrationService = new RegistrationService();
