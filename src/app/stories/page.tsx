import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import StoriesClient from "./StoriesClient";
import { getAllStoriesCached, getPageHeroCached, getSiteSettingsCached } from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: "The Catalog",
  description: "Browse the complete catalog of stories at Writer Lokam. Every story, catalogued and kept.",
};

export default async function StoriesIndexPage() {
  const stories = await getAllStoriesCached();
  const hero = await getPageHeroCached("stories");
  const settings = await getSiteSettingsCached();

  return (
    <>
      <Nav activePage="stories" cta={{ label: hero?.cta_primary_label || "Read Stories", href: hero?.cta_primary_href || "/stories" }} />
      <StoriesClient stories={stories} hero={hero} />
      <Newsletter heading={settings?.newsletter_heading} body={settings?.newsletter_body} />
      <Footer />
    </>
  );
}
