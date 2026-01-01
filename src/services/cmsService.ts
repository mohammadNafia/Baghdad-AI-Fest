import { supabase } from '@/lib/SupabaseClient';

export interface SiteSetting {
  id?: string;
  key: string;
  value: string;
  description?: string;
  category?: string;
}

export interface CMSSpeaker {
  id?: string;
  name: string;
  name_ar?: string;
  role: string;
  role_ar?: string;
  company: string;
  company_ar?: string;
  image: string;
  topic?: string;
  topic_ar?: string;
  bio?: string;
  bio_ar?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  order_index: number;
  display_order?: number;
  is_featured: boolean;
  is_active?: boolean;
}

class CMSService {
  // ============================================================================
  // SITE SETTINGS
  // ============================================================================

  async getAllSettings(): Promise<{ success: boolean; data?: SiteSetting[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching settings:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch settings' };
    }
  }

  async updateSetting(key: string, value: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error updating setting:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update setting' };
    }
  }

  async bulkUpdateSettings(settings: { key: string; value: string }[]): Promise<{ success: boolean; error?: string }> {
    try {
      const updates = settings.map(s => ({
        key: s.key,
        value: s.value,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('site_settings')
        .upsert(updates, { onConflict: 'key' });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error bulk updating settings:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update settings' };
    }
  }

  // ============================================================================
  // SPEAKERS MANAGEMENT
  // ============================================================================

  async getAllSpeakers(): Promise<{ success: boolean; data?: CMSSpeaker[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('speakers')
        .select('*')
        .order('order_index', { ascending: true, nullsFirst: false })
        .order('display_order', { ascending: true });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching speakers:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch speakers' };
    }
  }

  async createSpeaker(speaker: Omit<CMSSpeaker, 'id'>): Promise<{ success: boolean; data?: CMSSpeaker; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('speakers')
        .insert([speaker])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating speaker:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create speaker' };
    }
  }

  async updateSpeaker(id: string, speaker: Partial<CMSSpeaker>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('speakers')
        .update({ ...speaker, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error updating speaker:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update speaker' };
    }
  }

  async deleteSpeaker(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('speakers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting speaker:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete speaker' };
    }
  }

  async reorderSpeakers(speakerIds: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      for (let i = 0; i < speakerIds.length; i++) {
        const { error } = await supabase
          .from('speakers')
          .update({ order_index: i })
          .eq('id', speakerIds[i]);
        
        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error reordering speakers:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to reorder speakers' };
    }
  }

  // ============================================================================
  // CAPACITY MANAGEMENT
  // ============================================================================

  async getVenueCapacity(): Promise<{ success: boolean; capacity?: number; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'max_attendees')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { success: true, capacity: parseInt(data?.value || '250', 10) };
    } catch (error) {
      return { success: true, capacity: 250 }; // Default fallback
    }
  }

  async updateVenueCapacity(capacity: number): Promise<{ success: boolean; error?: string }> {
    return this.updateSetting('max_attendees', capacity.toString());
  }

  async getApprovedCount(): Promise<{ success: boolean; count?: number; error?: string }> {
    try {
      const { count, error } = await supabase
        .from('attendee_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      if (error) throw error;
      return { success: true, count: count || 0 };
    } catch (error) {
      console.error('Error getting approved count:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get count' };
    }
  }
}

export const cmsService = new CMSService();
