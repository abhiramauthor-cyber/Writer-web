import { getSiteSettingsCached } from "@/lib/data";
import { auth, currentUser } from "@clerk/nextjs/server";
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
  const settings = await getSiteSettingsCached();
  const { userId } = await auth();
  
  let isAdmin = false;
  if (userId) {
    const user = await currentUser();
    isAdmin = user?.primaryEmailAddress?.emailAddress?.toLowerCase() === "abhiramssk@gmail.com";
  }

  return <NavClient {...props} siteName={settings?.site_name || "Writer Lokam"} isAdmin={isAdmin} />;
}

