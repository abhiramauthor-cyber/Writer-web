import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import StoriesClient from "./StoriesClient";
import { getAllStories } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Catalog",
  description: "Browse the complete catalog of stories at Writer Lokam. Every story, catalogued and kept.",
};

export default async function StoriesIndexPage() {
  const stories = getAllStories();

  return (
    <>
      <Nav activePage="stories" cta={{ label: "Read Stories", href: "/stories" }} />
      <StoriesClient stories={stories} />
      <Newsletter />
      <Footer />
    </>
  );
}
