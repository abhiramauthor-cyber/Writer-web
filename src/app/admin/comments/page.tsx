import { createClient } from "@/lib/supabase/server";
import CommentsClient from "./CommentsClient";

export default async function CommentsServer() {
  const supabase = await createClient();
  
  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

  return <CommentsClient comments={comments || []} />;
}
