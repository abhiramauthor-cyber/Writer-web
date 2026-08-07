import { createClient } from "@/lib/supabase/server";
import AboutClient from "./AboutClient";

export default async function AdminAboutPage() {
  const supabase = await createClient();
  
  const { data: journeyItems } = await supabase.from("journey_items").select("*").order("sort_order", { ascending: true });
  const { data: achievements } = await supabase.from("achievements").select("*").order("sort_order", { ascending: true });

  return (
    <AboutClient 
      initialJourney={journeyItems || []} 
      initialAchievements={achievements || []} 
    />
  );
}
