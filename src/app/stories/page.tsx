import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import StoriesClient from "./StoriesClient";
import { getAllStories } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Catalog",
  description: "Browse the complete catalog of stories at Writer Lokam. Every story, catalogued and kept.",
};

export default async function StoriesIndexPage() {
  const stories = await getAllStories();
  const supabase = await createClient();
  const { data: hero } = await supabase.from("page_hero").select("*").eq("slug", "stories").single();
  const { data: settings } = await supabase.from("site_settings").select("newsletter_heading, newsletter_body").eq("id", 1).single();

  return (
    <>
      <Nav activePage="stories" cta={{ label: hero?.cta_primary_label || "Read Stories", href: hero?.cta_primary_href || "/stories" }} />
      <StoriesClient stories={stories} hero={hero} />
      <Newsletter heading={settings?.newsletter_heading} body={settings?.newsletter_body} />
      <Footer />
    </>
  );
}
