import { createClient } from "@/lib/supabase/server";
import StoryEditor from "./StoryEditor";

export default async function StoryEditorServer({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const supabase = await createClient();

  // Get distinct categories
  const { data: categoriesData } = await supabase.from("stories").select("category");
  const uniqueCategories = Array.from(new Set(categoriesData?.map(c => c.category).filter(Boolean)));
  
  if (slug === 'new') {
    // Get next catalog number
    const { data: maxCatalog } = await supabase.from("stories").select("catalog_no").order("catalog_no", { ascending: false }).limit(1).maybeSingle();
    const nextCatalogNo = maxCatalog ? maxCatalog.catalog_no + 1 : 1;
    
    return <StoryEditor initialStory={{ catalog_no: nextCatalogNo }} existingCategories={uniqueCategories} />;
  }

  const { data: story } = await supabase
    .from("stories")
    .select("*")
    .eq("slug", slug)
    .single();

  return <StoryEditor initialStory={story} existingCategories={uniqueCategories} />;
}
