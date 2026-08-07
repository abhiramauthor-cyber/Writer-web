"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Universal Image Uploader and Cleanup API
 * Uploads a new file to `public_assets` bucket and deletes the old file if `oldImageUrl` is provided.
 */
export async function uploadImage(formData: FormData, oldImageUrl?: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("public_assets")
    .upload(filePath, file);

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage
    .from("public_assets")
    .getPublicUrl(filePath);

  // Universal Image Cleanup
  if (oldImageUrl) {
    if (oldImageUrl.includes("/storage/v1/object/public/public_assets/")) {
      const oldPath = oldImageUrl.split("/storage/v1/object/public/public_assets/").pop();
      if (oldPath) {
        await supabase.storage.from("public_assets").remove([oldPath]);
      }
    }
  }

  return { url: data.publicUrl };
}

export async function deleteImage(imageUrl: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  if (imageUrl.includes("/storage/v1/object/public/public_assets/")) {
    const oldPath = imageUrl.split("/storage/v1/object/public/public_assets/").pop();
    if (oldPath) {
      const { error } = await supabase.storage.from("public_assets").remove([oldPath]);
      if (error) throw new Error(error.message);
    }
  }
}
