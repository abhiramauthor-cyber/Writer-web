import { getPageContent } from "@/lib/data";
import PagesClient from "./PagesClient";

export default async function PagesServer() {
  const homeContent = await getPageContent("home");
  const aboutContent = await getPageContent("about");

  return <PagesClient homeContent={homeContent} aboutContent={aboutContent} />;
}
