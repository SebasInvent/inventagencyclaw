// Supabase config — pulled from environment variables only.
// Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
// in .env.local (dev) and in Vercel/Cloudflare Pages env (prod).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // Fail loudly at startup instead of silently falling back to a stale URL.
  throw new Error(
    'Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and ' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY before building the app.',
  )
}

export const supabaseConfig = {
  url,
  anonKey,
}
