import type { Metadata } from "next";
import { spectral, literata, workSans } from "./fonts";
import "./globals.css";

import { getSiteSettingsCached } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsCached();

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://writerlokam.in"),
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
    icons: {
      icon: [
        { url: "/icon.png", type: "image/png" },
        { url: "/favicon.ico", type: "image/x-icon" },
      ],
      apple: [{ url: "/apple-icon.png" }],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ToastProvider } from "@/components/Toast";
import { BookmarkSyncProvider } from "@/components/BookmarkSync";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider telemetry={false}>
      <html
        lang="en"
        className={`${spectral.variable} ${literata.variable} ${workSans.variable} h-full`}
      >
        <body className="min-h-full flex flex-col bg-paper text-ink antialiased bg-grain">
          <ToastProvider>
            <BookmarkSyncProvider>
              <main id="main-content" className="flex-1 flex flex-col">
                {children}
              </main>
            </BookmarkSyncProvider>
          </ToastProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
