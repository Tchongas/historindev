import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser Supabase client (use for non-sensitive, client-side operations).
 * Prefer calling our API routes for writes so that RLS and validation remain enforced server-side.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabaseBrowser = createBrowserClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
