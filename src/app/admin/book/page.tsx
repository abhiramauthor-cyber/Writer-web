import { createClient } from "@/lib/supabase/server";
import BookClient from "./BookClient";

export default async function AdminBookPage() {
  const supabase = await createClient();
  
  const { data: bookDetails } = await supabase.from("book_details").select("*").eq("id", 1).single();
  const { data: reviews } = await supabase.from("reviews").select("*").order("sort_order", { ascending: true });
  const { data: buyLinks } = await supabase.from("buy_links").select("*").order("sort_order", { ascending: true });

  return (
    <BookClient 
      initialDetails={bookDetails || {}} 
      initialReviews={reviews || []} 
      initialBuyLinks={buyLinks || []} 
    />
  );
}
