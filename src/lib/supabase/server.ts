import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Server-only Supabase client.
 * - Uses Service Role key if available (server-side only) for trusted operations.
 * - Falls back to anon key for environments where service role isn't configured.
 * - Cookies set/remove are no-ops in route handlers to avoid runtime errors.
 */
export async function getSupabaseServerClient<TDatabase = any>(): Promise<SupabaseClient<TDatabase>> {
  // Next.js route handlers require awaiting cookies()
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return createServerClient<TDatabase>(
    supabaseUrl,
    (serviceRoleKey || anonKey) as string,
    {
      cookies: {
        async get(name: string) {
          return cookieStore.get(name)?.value;
        },
        async set(_name: string, _value: string, _options: CookieOptions) {},
        async remove(_name: string, _options: CookieOptions) {},
      },
    }
  );
}

export function getSupabaseServiceRoleClient<TDatabase = any>(): SupabaseClient<TDatabase> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  }

  return createClient<TDatabase>(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
