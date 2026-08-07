import { createClient } from "@/lib/supabase/server";
import MediaClient from "./MediaClient";

export default async function AdminMediaPage() {
  const supabase = await createClient();
  
  const { data: files } = await supabase.storage.from("public_assets").list();

  // Filter out the .emptyFolderPlaceholder if it exists, and get public URLs
  const validFiles = (files || [])
    .filter(f => f.name !== '.emptyFolderPlaceholder')
    .map(f => {
      const { data } = supabase.storage.from("public_assets").getPublicUrl(f.name);
      return {
        name: f.name,
        url: data.publicUrl,
        created_at: f.created_at,
      };
    })
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

  return <MediaClient initialFiles={validFiles} />;
}
