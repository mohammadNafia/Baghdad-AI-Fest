import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase environment variables are missing');
}

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Admin API endpoints
 * GET /api/admin/submissions - Get all submissions
 * GET /api/admin/analytics - Get analytics data
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!supabase) {
    return res.status(500).json({ 
      success: false, 
      error: 'Database not configured' 
    });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  const { endpoint } = req.query;

  try {
    if (endpoint === 'submissions') {
      // Fetch all submissions
      const [attendeesResult, speakersResult, partnersResult] = await Promise.all([
        supabase.from('attendees').select('*').order('created_at', { ascending: false }),
        supabase.from('speakers').select('*').order('created_at', { ascending: false }),
        supabase.from('partners').select('*').order('created_at', { ascending: false }),
      ]);

      if (attendeesResult.error) throw attendeesResult.error;
      if (speakersResult.error) throw speakersResult.error;
      if (partnersResult.error) throw partnersResult.error;

      // Create activity log
      const activityLog = [
        ...(attendeesResult.data || []).map((item: any) => ({
          type: 'attendee',
          name: item.name,
          email: item.email,
          timestamp: item.created_at,
          id: item.id
        })),
        ...(speakersResult.data || []).map((item: any) => ({
          type: 'speaker',
          name: item.name,
          email: item.email,
          timestamp: item.created_at,
          id: item.id
        })),
        ...(partnersResult.data || []).map((item: any) => ({
          type: 'partner',
          name: item.organization || item.companyName,
          email: item.email,
          timestamp: item.created_at,
          id: item.id
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return res.status(200).json({
        success: true,
        data: {
          attendees: attendeesResult.data || [],
          speakers: speakersResult.data || [],
          partners: partnersResult.data || [],
          activityLog
        }
      });
    }

    if (endpoint === 'analytics') {
      // Fetch all data for analytics
      const [attendeesResult, speakersResult, partnersResult] = await Promise.all([
        supabase.from('attendees').select('*'),
        supabase.from('speakers').select('*'),
        supabase.from('partners').select('*'),
      ]);

      if (attendeesResult.error) throw attendeesResult.error;
      if (speakersResult.error) throw speakersResult.error;
      if (partnersResult.error) throw partnersResult.error;

      const attendees = attendeesResult.data || [];
      const speakers = speakersResult.data || [];
      const partners = partnersResult.data || [];

      // Calculate most common occupation
      const occupations = attendees.map((a: any) => a.occupation).filter(Boolean);
      const occupationCounts: Record<string, number> = {};
      occupations.forEach((occ: string) => {
        occupationCounts[occ] = (occupationCounts[occ] || 0) + 1;
      });
      const mostCommonOccupation = Object.entries(occupationCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

      // Calculate top partnership category
      const categories = partners.map((p: any) => p.category || p.partnershipType).filter(Boolean);
      const categoryCounts: Record<string, number> = {};
      categories.forEach((cat: string) => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
      const topCategory = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

      return res.status(200).json({
        success: true,
        data: {
          totalAttendees: attendees.length,
          totalSpeakers: speakers.length,
          totalPartners: partners.length,
          mostCommonOccupation,
          topPartnershipCategory: topCategory
        }
      });
    }

    return res.status(400).json({
      success: false,
      error: 'Invalid endpoint'
    });
  } catch (error: any) {
    console.error('[API] Admin error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred'
    });
  }
}
