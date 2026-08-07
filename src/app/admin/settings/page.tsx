import { createClient } from "@/lib/supabase/server";
import SettingsClient from "./SettingsClient";

export default async function SettingsServer() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  const { data: author } = await supabase.from("author_profile").select("*").eq("id", 1).single();

  return <SettingsClient initialSettings={settings || {}} initialAuthor={author || {}} />;
}
