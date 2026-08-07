import { createClient } from "@/lib/supabase/server";
import StoryEditor from "./StoryEditor";

export default async function StoryEditorServer({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (slug === 'new') {
    return <StoryEditor initialStory={null} />;
  }

  const supabase = await createClient();
  const { data: story } = await supabase
    .from("stories")
    .select("*")
    .eq("slug", slug)
    .single();

  return <StoryEditor initialStory={story} />;
}
