import type { Metadata } from "next";
import { spectral, literata, workSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://writerlokam.com"),
  title: {
    default: "Writer Lokam — Original Short Fiction",
    template: "%s · Writer Lokam",
  },
  description: "A reading room of original fiction about love, memory, hope, and longing — catalogued, kept, and added to every month. Home of Two States, One Heart.",
  openGraph: {
    title: "Writer Lokam — Original Short Fiction",
    description: "A reading room of original fiction about love, memory, hope, and longing — catalogued, kept, and added to every month. Home of Two States, One Heart.",
    url: "/",
    siteName: "Writer Lokam",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Writer Lokam",
    description: "A digital library catalog of original short fiction by Abhi.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
