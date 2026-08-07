import type { Metadata } from "next";
import { spectral, literata, workSans } from "./fonts";
import "./globals.css";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await supabaseAdmin.from("site_settings").select("*").eq("id", 1).single();

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://writerlokam.com"),
    title: {
      default: `${settings?.site_name || "Writer Lokam"} — ${settings?.tagline || "Original Short Fiction"}`,
      template: `%s · ${settings?.site_name || "Writer Lokam"}`,
    },
    description: settings?.meta_description || "A reading room of original fiction about love, memory, hope, and longing.",
    openGraph: {
      title: `${settings?.site_name || "Writer Lokam"} — ${settings?.tagline || "Original Short Fiction"}`,
      description: settings?.meta_description || "A reading room of original fiction about love, memory, hope, and longing.",
      url: "/",
      siteName: settings?.site_name || "Writer Lokam",
      locale: "en_US",
      type: "website",
      images: settings?.og_image_url ? [{ url: settings.og_image_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: settings?.site_name || "Writer Lokam",
      description: settings?.meta_description || "A reading room of original fiction about love, memory, hope, and longing.",
      images: settings?.og_image_url ? [settings.og_image_url] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spectral.variable} ${literata.variable} ${workSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
