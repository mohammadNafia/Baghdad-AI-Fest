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
 * Handle form submissions (attendees, speakers, partners)
 * POST /api/forms
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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

  const { type, data } = req.body;

  if (req.method === 'POST') {
    try {
      let result;

      switch (type) {
        case 'attendee': {
          // Check capacity before allowing registration
          const MAX_CAPACITY = 250;
          const { count } = await supabase
            .from('attendees')
            .select('*', { count: 'exact', head: true });

          if (count && count >= MAX_CAPACITY) {
            return res.status(400).json({
              success: false,
              error: 'Registration Closed: Capacity Reached.'
            });
          }

          const { data: inserted, error } = await supabase
            .from('attendees')
            .insert({
              name: data.name,
              email: data.email?.toLowerCase().trim(),
              phone: data.phone,
              age: data.age,
              occupation: data.occupation,
              organization: data.organization || data.institution || '',
              motivation: data.motivation,
              newsletter: data.newsletter || false,
              status: 'pending',
              created_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (error) {
            if (error.code === '23505') {
              return res.status(400).json({
                success: false,
                error: 'This email is already registered'
              });
            }
            throw error;
          }

          result = inserted;
          break;
        }

        case 'speaker': {
          const { data: inserted, error } = await supabase
            .from('speakers')
            .insert({
              name: data.name,
              email: data.email?.toLowerCase().trim(),
              phone: data.phone,
              bio: data.bio,
              topic: data.topic,
              experience: data.experience,
              organization: data.organization,
              status: 'pending',
              created_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (error) {
            if (error.code === '23505') {
              return res.status(400).json({
                success: false,
                error: 'This email is already registered'
              });
            }
            throw error;
          }

          result = inserted;
          break;
        }

        case 'partner': {
          const { data: inserted, error } = await supabase
            .from('partners')
            .insert({
              organization: data.organization,
              email: data.email?.toLowerCase().trim(),
              category: data.category,
              requirements: data.requirements,
              status: 'pending',
              created_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (error) {
            if (error.code === '23505') {
              return res.status(400).json({
                success: false,
                error: 'This email is already registered'
              });
            }
            throw error;
          }

          result = inserted;
          break;
        }

        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid form type'
          });
      }

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('[API] Form submission error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'An unexpected error occurred'
      });
    }
  }

  if (req.method === 'GET') {
    try {
      const { type: formType } = req.query;

      let result;

      switch (formType) {
        case 'attendees': {
          const { data, error } = await supabase
            .from('attendees')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          result = data;
          break;
        }

        case 'speakers': {
          const { data, error } = await supabase
            .from('speakers')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          result = data;
          break;
        }

        case 'partners': {
          const { data, error } = await supabase
            .from('partners')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          result = data;
          break;
        }

        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid form type'
          });
      }

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('[API] Fetch error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'An unexpected error occurred'
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  });
}
