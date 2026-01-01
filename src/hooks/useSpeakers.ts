import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/SupabaseClient';
import { SPEAKERS } from '@/data/speakers';

/**
 * Speaker interface matching the Supabase `speakers` table schema
 * Includes localized fields for Arabic content
 */
export interface Speaker {
  id: string;
  name: string;
  name_ar?: string | null;
  role: string;
  role_ar?: string | null;
  company: string;
  company_ar?: string | null;
  image: string;
  topic?: string | null;
  topic_ar?: string | null;
  bio?: string | null;
  bio_ar?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  website?: string | null;
  is_featured: boolean;
  display_order: number;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Hook return type
 */
interface UseSpeakersReturn {
  speakers: Speaker[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  getLocalizedSpeaker: (speaker: Speaker, lang: 'en' | 'ar') => {
    name: string;
    role: string;
    company: string;
    topic: string | null;
    bio: string | null;
  };
}

/**
 * Custom hook to fetch speakers from Supabase
 * Falls back to static data if Supabase is not configured or fetch fails
 * 
 * @param featuredOnly - If true, only fetch featured speakers
 * @returns Object containing speakers array, loading state, error, refetch function, and localization helper
 */
export const useSpeakers = (featuredOnly: boolean = false): UseSpeakersReturn => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Get localized speaker fields based on language
   */
  const getLocalizedSpeaker = (speaker: Speaker, lang: 'en' | 'ar') => ({
    name: (lang === 'ar' && speaker.name_ar) ? speaker.name_ar : speaker.name,
    role: (lang === 'ar' && speaker.role_ar) ? speaker.role_ar : speaker.role,
    company: (lang === 'ar' && speaker.company_ar) ? speaker.company_ar : speaker.company,
    topic: (lang === 'ar' && speaker.topic_ar) ? speaker.topic_ar : speaker.topic ?? null,
    bio: (lang === 'ar' && speaker.bio_ar) ? speaker.bio_ar : speaker.bio ?? null,
  });

  const fetchSpeakers = async (): Promise<void> => {
    // If Supabase is not configured, use static data
    if (!isSupabaseConfigured()) {
      console.info('Supabase not configured, using static speakers data');
      const staticSpeakers = SPEAKERS.map((s, index) => ({
        id: s.id.toString(),
        name: s.name,
        role: s.role,
        company: s.company,
        image: s.image,
        topic: s.topic || null,
        bio: s.bio || null,
        linkedin: s.socialLinks?.linkedin || null,
        twitter: s.socialLinks?.twitter || null,
        website: s.socialLinks?.website || null,
        is_featured: true,
        display_order: index + 1,
      }));
      setSpeakers(staticSpeakers);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Extra safety check - if supabase is null, fall back to static data
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      let query = supabase
        .from('speakers')
        .select('*')
        .order('order_index', { ascending: true, nullsFirst: false })
        .order('display_order', { ascending: true });

      // Filter by featured if requested
      if (featuredOnly) {
        query = query.eq('is_featured', true);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (data && data.length > 0) {
        setSpeakers(data as Speaker[]);
      } else {
        // Fallback to static data if no speakers in database
        console.info('No speakers in database, using static data');
        const staticSpeakers = SPEAKERS.map((s, index) => ({
          id: s.id.toString(),
          name: s.name,
          role: s.role,
          company: s.company,
          image: s.image,
          topic: s.topic || null,
          bio: s.bio || null,
          linkedin: s.socialLinks?.linkedin || null,
          twitter: s.socialLinks?.twitter || null,
          website: s.socialLinks?.website || null,
          is_featured: true,
          display_order: index + 1,
        }));
        setSpeakers(staticSpeakers);
      }
    } catch (err) {
      console.error('Error fetching speakers:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch speakers'));
      
      // Fallback to static data on error
      const staticSpeakers = SPEAKERS.map((s, index) => ({
        id: s.id.toString(),
        name: s.name,
        role: s.role,
        company: s.company,
        image: s.image,
        topic: s.topic || null,
        bio: s.bio || null,
        linkedin: s.socialLinks?.linkedin || null,
        twitter: s.socialLinks?.twitter || null,
        website: s.socialLinks?.website || null,
        is_featured: true,
        display_order: index + 1,
      }));
      setSpeakers(staticSpeakers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, [featuredOnly]);

  return {
    speakers,
    loading,
    error,
    refetch: fetchSpeakers,
    getLocalizedSpeaker,
  };
};

