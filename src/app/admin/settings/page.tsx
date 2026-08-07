import { createClient } from "@/lib/supabase/server";
import SettingsClient from "./SettingsClient";

export default async function SettingsServer() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();

  return <SettingsClient 
    initialMaintenanceMode={data?.is_maintenance_mode || false} 
    initialSocialLinks={data?.social_links || {}}
  />;
}
