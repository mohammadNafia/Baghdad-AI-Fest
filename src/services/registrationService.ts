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

<<<<<<< HEAD
// ---------------------------------------------------------------------------
// Local fallback store (used when Supabase isn't configured or during tests)
// ---------------------------------------------------------------------------
type TableKey = 'attendees' | 'speakers' | 'partners';

const FALLBACK_STORE: Record<TableKey, any[]> = {
  attendees: [],
  speakers: [],
  partners: []
};

const getStoreKey = (table: TableKey) => table;

const readLocal = (table: TableKey) => {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(getStoreKey(table));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch (error) {
    console.warn('[RegistrationService] Failed to read local storage, using memory store', error);
  }
  return FALLBACK_STORE[table];
};

const writeLocal = (table: TableKey, data: any[]) => {
  FALLBACK_STORE[table] = data;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(getStoreKey(table), JSON.stringify(data));
    }
  } catch (error) {
    console.warn('[RegistrationService] Failed to persist local storage fallback', error);
  }
};

const normalizeAttendee = (data: Partial<AttendeeFormData>) => {
  const timestamp = new Date().toISOString();
  return {
    id: data.id || `local-attendee-${Date.now()}`,
    name: data.name || '',
    email: (data.email || '').toLowerCase().trim(),
    phone: data.phone || '',
    age: typeof data.age === 'string' ? Number(data.age) || data.age : data.age ?? '',
    occupation: data.occupation || '',
    organization: data.organization || data.institution || '',
    motivation: data.motivation || '',
    newsletter: !!data.newsletter,
    status: (data as AttendeeFormData).status || 'pending',
    created_at: (data as any).created_at || timestamp,
    dateSubmitted: (data as any).dateSubmitted || timestamp
  };
};

const normalizeSpeaker = (data: Partial<SpeakerFormData>) => {
  const timestamp = new Date().toISOString();
  return {
    id: data.id || `local-speaker-${Date.now()}`,
    name: data.name || '',
    occupation: data.occupation || '',
    institution: data.institution || data.organization || '',
    email: (data.email || '').toLowerCase().trim(),
    phone: data.phone || '',
    skills: data.skills || '',
    experience: data.experience || '',
    topics: data.topics || '',
    achievements: data.achievements || '',
    status: (data as any).status || 'pending',
    dateSubmitted: (data as any).dateSubmitted || timestamp,
    created_at: (data as any).created_at || timestamp
  };
};

const normalizePartner = (data: Partial<PartnerFormData>) => {
  const timestamp = new Date().toISOString();
  return {
    id: data.id || `local-partner-${Date.now()}`,
    organization: data.organization || '',
    email: (data.email || '').toLowerCase().trim(),
    category: data.category || (data as any).partnershipType || '',
    requirements: data.requirements || '',
    status: (data as any).status || 'pending',
    dateSubmitted: (data as any).dateSubmitted || timestamp,
    created_at: (data as any).created_at || timestamp
  };
};

=======
>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660
class RegistrationService {
  /**
   * Get total attendee count (all statuses)
   */
  async getTotalAttendeeCount(): Promise<{ success: boolean; count?: number; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
<<<<<<< HEAD
        const local = readLocal('attendees');
        return { success: true, count: local.length };
=======
        return { success: true, count: 0 };
>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660
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
<<<<<<< HEAD
=======
      if (!isSupabaseConfigured()) {
        console.error('[RegistrationService] Supabase not configured');
        return { success: false, error: 'Database not configured' };
      }

>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660
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

<<<<<<< HEAD
      // Local fallback when Supabase isn't configured (or in offline mode)
      if (!isSupabaseConfigured()) {
        const attendees = readLocal('attendees');
        const newAttendee = normalizeAttendee({
          ...formData,
          status: 'pending'
        });
        attendees.unshift(newAttendee);
        writeLocal('attendees', attendees);
        console.log('[RegistrationService] Stored attendee locally (fallback)');
        return { success: true, data: newAttendee };
      }

=======
>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660
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
<<<<<<< HEAD
        const speakers = readLocal('speakers');
        const newSpeaker = normalizeSpeaker({
          ...formData,
          status: 'pending'
        });
        speakers.unshift(newSpeaker);
        writeLocal('speakers', speakers);
        return { success: true, data: newSpeaker };
=======
        console.error('[RegistrationService] Supabase not configured');
        return { success: false, error: 'Database not configured' };
>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660
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
<<<<<<< HEAD
        const partners = readLocal('partners');
        const newPartner = normalizePartner({
          ...formData,
          status: 'pending'
        });
        partners.unshift(newPartner);
        writeLocal('partners', partners);
        return { success: true, data: newPartner };
=======
        console.error('[RegistrationService] Supabase not configured');
        return { success: false, error: 'Database not configured' };
>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660
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
<<<<<<< HEAD
        const data = readLocal('attendees').map(normalizeAttendee);
        return { success: true, data };
=======
        console.warn('[RegistrationService] Supabase not configured, returning empty array');
        return { success: true, data: [] };
>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660
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
<<<<<<< HEAD
        const data = readLocal('speakers').map(normalizeSpeaker);
        return { success: true, data };
=======
        console.warn('[RegistrationService] Supabase not configured, returning empty array');
        return { success: true, data: [] };
>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660
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
<<<<<<< HEAD
        const data = readLocal('partners').map(normalizePartner);
        return { success: true, data };
=======
        console.warn('[RegistrationService] Supabase not configured, returning empty array');
        return { success: true, data: [] };
>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660
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
<<<<<<< HEAD
        const attendees = readLocal('attendees').map(normalizeAttendee);
        const idx = attendees.findIndex(a => String(a.id) === String(id));
        if (idx === -1) {
          return { success: false, error: 'Attendee not found' };
        }
        attendees[idx] = {
          ...attendees[idx],
          status,
          updated_at: new Date().toISOString()
        };
        writeLocal('attendees', attendees);
        return { success: true, data: attendees[idx] };
=======
        console.error('[RegistrationService] Supabase not configured');
        return { success: false, error: 'Database not configured' };
>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660
      }

      console.log('[RegistrationService] Updating attendee status:', id, status);
      
<<<<<<< HEAD
      const query = supabase
        .from('attendees')  // CORRECT TABLE NAME
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      const selectable = typeof (query as any).select === 'function'
        ? (query as any).select()
        : query;

      const result = (selectable as any)?.single
        ? await (selectable as any).single()
        : selectable;

      if (result?.error) {
        console.error('[RegistrationService] Error updating status:', result.error);
        return { success: false, error: result.error.message };
      }

      console.log('[RegistrationService] Status updated successfully:', result?.data);
      return { success: true, data: result?.data };
=======
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
>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660
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
<<<<<<< HEAD
        const attendees = readLocal('attendees').map(normalizeAttendee);
        const count = attendees.filter(a => a.status === 'approved').length;
        return { success: true, count };
=======
        return { success: true, count: 0 };
>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660
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
<<<<<<< HEAD
      const normalizedEmail = email.toLowerCase().trim();

      // Local fallback first when Supabase isn't configured
      if (!isSupabaseConfigured()) {
        const attendees = readLocal('attendees').map(normalizeAttendee);
        const found = attendees.find(a => a.email === normalizedEmail);
        if (!found) {
          console.log('[RegistrationService] No registration found (local):', email);
          return { success: false, error: 'No registration found with this email' };
        }
        return { success: true, data: found };
      }

      console.log('[RegistrationService] Searching for attendee:', email);

      const tableRef: any = supabase.from('attendees');  // CORRECT TABLE NAME
      const baseQuery = typeof tableRef.select === 'function'
        ? tableRef.select('*')
        : tableRef;

      const eqSource: any = baseQuery && typeof baseQuery.eq === 'function'
        ? baseQuery
        : typeof tableRef.eq === 'function'
          ? tableRef
          : null;

      const filtered = eqSource ? eqSource.eq('email', normalizedEmail) : baseQuery;
      const result = filtered?.single ? await filtered.single() : filtered;
      const data = result?.data || (Array.isArray(result?.data) ? result.data[0] : undefined) || result?.[0];
      const error = result?.error;
=======
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
>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660

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
