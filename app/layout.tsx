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
 * Noto Sans Kannada, cut down to the ~30 characters of the committee's
 * Kannada name — the only Kannada on the site. The full face is 89 kB and
 * drags a 28 kB Latin slice along with it; this is 6.6 kB and nothing else.
 * Regenerate with `python scripts/subset-kannada.py` if that string changes.
 */
const kannada = localFont({
  src: "../public/fonts/noto-sans-kannada-subset.woff2",
  variable: "--font-kannada-sans",
  display: "swap",
  weight: "400",
  preload: false,
});

const description = `${festival.organisation} presents the ${festival.edition} year of ${festival.name} — two days of faith, culture and community in Riches Garden, Ramamurthy Nagar, Bengaluru. Children's cultural programme registrations open.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${festival.name} ${festival.year} · ${festival.edition} Year`,
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
    "children's cultural programme",
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
      className={`${cormorant.variable} ${instrument.variable} ${kannada.variable}`}
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
