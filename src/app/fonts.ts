import { Spectral, Literata, Work_Sans } from "next/font/google";

export const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const literata = Literata({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ui",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

