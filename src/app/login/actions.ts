"use server";

import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function developerLogin() {
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email: "abhiramssk@gmail.com",
  });

  if (error || !data?.properties?.action_link) {
    console.error("Failed to generate admin login link:", error);
    throw new Error("Could not generate login link");
  }

  // Parse the token_hash from the generated link
  const url = new URL(data.properties.action_link);
  const token_hash = url.searchParams.get("token");

  if (!token_hash) {
    throw new Error("No token hash found in link");
  }

  // Use the SSR client to verify the OTP and set the cookies!
  const supabase = await createClient();
  const { error: verifyError } = await supabase.auth.verifyOtp({
    type: "magiclink",
    token_hash,
  });

  if (verifyError) {
    console.error("Failed to verify OTP:", verifyError);
    throw new Error("Failed to verify developer login");
  }

  // We are now logged in! Redirect to admin.
  redirect("/admin");
}
