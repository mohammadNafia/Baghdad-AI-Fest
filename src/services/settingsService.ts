/**
 * Settings Service - Manages site settings in Supabase
 * 
 * Handles:
 * - Getting settings from site_settings table
 * - Updating settings (registrations_open, show_speakers, etc.)
 */

import { supabase, isSupabaseConfigured } from '@/lib/SupabaseClient';

export interface SettingsResult {
  success: boolean;
  data?: any;
  error?: string;
}

<<<<<<< HEAD
// Local fallback storage for settings when Supabase isn't configured
const SETTINGS_KEY = 'site_settings';
const DEFAULT_SETTINGS = [
  { key: 'registrations_open', value: 'true' },
  { key: 'show_speakers', value: 'true' },
];

const readSettings = () => {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } else {
        // Seed defaults if none exist
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
    }
  } catch (error) {
    console.warn('[SettingsService] Failed to read local settings, using defaults', error);
  }
  return DEFAULT_SETTINGS;
};

const writeSettings = (settings: { key: string; value: string }[]) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  } catch (error) {
    console.warn('[SettingsService] Failed to persist local settings', error);
  }
};

=======
>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660
class SettingsService {
  /**
   * Get a specific setting value
   */
  async getSetting(key: string): Promise<{ success: boolean; value?: string; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
<<<<<<< HEAD
        const settings = readSettings();
        const found = settings.find((item) => item.key === key);
        return { success: true, value: found?.value };
=======
        return { success: false, error: 'Database not configured' };
>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660
      }

      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Setting doesn't exist, return default
          return { success: true, value: undefined };
        }
        console.error('[SettingsService] Error getting setting:', error);
        return { success: false, error: error.message };
      }

      return { success: true, value: data?.value };
    } catch (error) {
      console.error('[SettingsService] Unexpected error getting setting:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get setting',
      };
    }
  }

  /**
   * Get all settings
   */
  async getAllSettings(): Promise<SettingsResult> {
    try {
      if (!isSupabaseConfigured()) {
<<<<<<< HEAD
        const settings = readSettings();
        const mapped: Record<string, string> = {};
        settings.forEach((row) => {
          mapped[row.key] = row.value;
        });
        return { success: true, data: mapped };
=======
        return { success: false, error: 'Database not configured' };
>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660
      }

      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .order('key');

      if (error) {
        console.error('[SettingsService] Error getting settings:', error);
        return { success: false, error: error.message };
      }

      // Convert to object
      const settings: Record<string, string> = {};
      if (data) {
        data.forEach((row: { key: string; value: string }) => {
          settings[row.key] = row.value;
        });
      }

      return { success: true, data: settings };
    } catch (error) {
      console.error('[SettingsService] Unexpected error getting settings:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get settings',
      };
    }
  }

  /**
   * Update a setting (upsert - creates if doesn't exist)
   */
  async updateSetting(key: string, value: string): Promise<SettingsResult> {
    try {
      if (!isSupabaseConfigured()) {
<<<<<<< HEAD
        const settings = readSettings();
        const idx = settings.findIndex((item) => item.key === key);
        const updated = { key, value, updated_at: new Date().toISOString() };
        if (idx === -1) settings.push(updated);
        else settings[idx] = updated;
        writeSettings(settings);
        return { success: true, data: updated };
=======
        return { success: false, error: 'Database not configured' };
>>>>>>> 0006e50519a9394e9dd4814976b32663b3186660
      }

      console.log('[SettingsService] Updating setting:', key, value);

      // Use upsert to create or update
      const { data, error } = await supabase
        .from('site_settings')
        .upsert(
          {
            key,
            value,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'key',
          }
        )
        .select()
        .single();

      if (error) {
        console.error('[SettingsService] Error updating setting:', error);
        return { success: false, error: error.message };
      }

      console.log('[SettingsService] Setting updated successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('[SettingsService] Unexpected error updating setting:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update setting',
      };
    }
  }

  /**
   * Get registrations_open setting (returns boolean)
   */
  async isRegistrationOpen(): Promise<boolean> {
    const result = await this.getSetting('registrations_open');
    if (result.success && result.value) {
      return result.value === 'true' || result.value === '1';
    }
    // Default to true if not set
    return true;
  }

  /**
   * Get show_speakers setting (returns boolean)
   */
  async isShowSpeakers(): Promise<boolean> {
    const result = await this.getSetting('show_speakers');
    if (result.success && result.value) {
      return result.value === 'true' || result.value === '1';
    }
    // Default to true if not set
    return true;
  }

  /**
   * Set registrations_open
   */
  async setRegistrationOpen(open: boolean): Promise<SettingsResult> {
    return this.updateSetting('registrations_open', open ? 'true' : 'false');
  }

  /**
   * Set show_speakers
   */
  async setShowSpeakers(show: boolean): Promise<SettingsResult> {
    return this.updateSetting('show_speakers', show ? 'true' : 'false');
  }
}

export const settingsService = new SettingsService();
