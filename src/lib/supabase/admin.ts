import { createClient } from "@supabase/supabase-js";

// This client does not use cookies, so it is safe to use in generateStaticParams and generateMetadata
// It uses the anon key by default (for public data) or the service role key if available (for admin data)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
