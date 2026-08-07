import { createClient } from "@/lib/supabase/server";
import NavClient from "./NavClient";

interface NavCta {
  label: string;
  href: string;
}

interface NavProps {
  /** Which page is active — drives the highlighted nav link */
  activePage?: "home" | "stories" | "book" | "about";
  /** Per-page CTA button in the header */
  cta?: NavCta;
  /** "reading" renders the compact story-reading nav */
  variant?: "default" | "reading";
}

export default async function Nav(props: NavProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: settings } = await supabase.from('site_settings').select('site_name').eq('id', 1).single();

  return <NavClient {...props} user={user} siteName={settings?.site_name || "Writer Lokam"} />;
}
