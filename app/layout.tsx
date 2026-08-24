import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";

import { Providers } from "@/components/layout/Providers";
import { festival, siteUrl } from "@/content";

import "./globals.css";

/**
 * Fonts are self-hosted by next/font — no request ever leaves for a font CDN,
 * which keeps both the content security policy and the first paint tight.
 *
 * No `weight` is given anywhere: each of these families has a variable
 * version, and omitting the array makes next/font serve that single file
 * instead of one static file per weight. Naming five weights and two styles
 * for the display face alone pulled ten files and roughly 160 kB.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

/**
 * The two Kannada faces, cut down to the characters the site actually shows —
 * 46 of them. The full faces are ~90 kB and ~119 kB, and each drags a Latin
 * slice along behind it; these are 16 kB and 20 kB and pull nothing extra.
 * Serif carries display sizes so Kannada headings sit with the Latin display
 * serif; sans carries everything else, where readability wins.
 *
 * Regenerate with `npm run kannada` after editing any Kannada string.
 */
const kannadaSans = localFont({
  src: "../public/fonts/noto-sans-kannada-subset.woff2",
  variable: "--font-kannada-sans",
  display: "swap",
  weight: "400",
  preload: false,
});

const kannadaSerif = localFont({
  src: "../public/fonts/noto-serif-kannada-subset.woff2",
  variable: "--font-kannada-serif",
  display: "swap",
  weight: "400",
  preload: false,
});

const description = `${festival.organisation} — ${festival.edition}, ${festival.dates}. Three days of faith, culture and community in Riches Garden, Ramamurthy Nagar, Bengaluru. Stage events registration open.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${festival.name} ${festival.year} · ${festival.edition}`,
    template: `%s · ${festival.name}`,
  },
  description,
  applicationName: festival.name,
  keywords: [
    "Ganeshothsava",
    "Ganesha Utsav",
    "Riches Garden",
    "Ramamurthy Nagar",
    "Bengaluru",
    "stage events",
  ],
  openGraph: {
    type: "website",
    siteName: festival.name,
    title: `${festival.name} ${festival.year}`,
    description,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#6e1025",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      data-lang="en"
      className={`${cormorant.variable} ${instrument.variable} ${kannadaSans.variable} ${kannadaSerif.variable}`}
    >
      <body>
        {/*
          Without JavaScript: the loader could never dismiss itself, and every
          scroll-reveal would stay in its hidden starting state. Both are
          undone here so the whole site still reads — just without motion.
        */}
        <noscript>
          <style>{`.loader{display:none!important}body{overflow:auto!important}[data-reveal],[data-reveal] *{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
