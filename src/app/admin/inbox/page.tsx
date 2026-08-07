import { createClient } from "@/lib/supabase/server";
import InboxClient from "./InboxClient";

export default async function AdminInboxPage() {
  const supabase = await createClient();
  
  // Fetch contact messages
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch subscribers
  const { data: subscribers } = await supabase
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <InboxClient 
      messages={messages || []} 
      subscribers={subscribers || []} 
    />
  );
}
