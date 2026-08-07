import { createClient } from "@/lib/supabase/server";
import PagesClient from "./PagesClient";

export default async function PagesServer() {
  const supabase = await createClient();
  const { data: heroes } = await supabase.from("page_hero").select("*");

  return <PagesClient heroes={heroes || []} />;
}
