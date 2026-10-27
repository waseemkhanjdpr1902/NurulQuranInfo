import type { Metadata } from "next";
import Script from "next/script";
import {
  Inter,
  Playfair_Display,
  Amiri,
  Noto_Sans_Devanagari,
} from "next/font/google";
import "./globals.css";
import { PrayerTimesProvider } from "@/components/PrayerTimesProvider";
import { UILanguageProvider } from "@/components/UILanguageProvider";
import AppInstall from "@/components/AppInstall";

const hindi = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-hindi",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://nurulquran.info",
  ),
  title: {
    default: "NurulQuran — Read, Reflect and Remember",
    template: "%s | NurulQuran",
  },
  description:
    "Read the Holy Quran, explore tafseer and authentic Islamic resources, and use practical tools for prayer, duas, tasbih and zakat.",
  applicationName: "NurulQuran",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "NurulQuran",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icons/nurulquran-192.png",
    apple: "/icons/nurulquran-180.png",
  },
  keywords: [
    "Quran",
    "Holy Quran",
    "Tafseer",
    "Islamic tools",
    "Dua",
    "Prayer times",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "NurulQuran",
    title: "NurulQuran — Read, Reflect and Remember",
    description:
      "Read the Holy Quran, explore tafseer and use practical Islamic tools in a calm, accessible experience.",
  },
  twitter: {
    card: "summary",
    title: "NurulQuran — Read, Reflect and Remember",
    description:
      "Read the Holy Quran, explore tafseer and use practical Islamic tools.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${amiri.variable} ${hindi.variable}`}
      >
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-1MRBMDGBLC" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag(\x27js\x27, new Date());
          gtag(\x27config\x27, \x27G-1MRBMDGBLC\x27);
        `}</Script>
        <UILanguageProvider>
          <PrayerTimesProvider>
            {children}
            <AppInstall />
          </PrayerTimesProvider>
        </UILanguageProvider>
      </body>
    </html>
  );
}
