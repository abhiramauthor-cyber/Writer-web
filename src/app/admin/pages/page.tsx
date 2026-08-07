import { getPageContent } from "@/lib/data";
import PagesClient from "./PagesClient";

export default async function PagesServer() {
  const aboutContent = await getPageContent("about");
  const bookContent = await getPageContent("book");

  return <PagesClient aboutContent={aboutContent || {}} bookContent={bookContent || {}} />;
}
