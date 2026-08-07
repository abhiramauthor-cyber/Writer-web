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

  return <NavClient {...props} user={user} />;
}
