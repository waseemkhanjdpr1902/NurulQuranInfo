import type { Metadata } from "next";
import { Inter, Playfair_Display, Amiri } from "next/font/google";
import PWARegister from "@/components/PWARegister";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-arabic" });

export const metadata: Metadata = {
  metadataBase: new URL("https://nurulquran.info"),
  title: {
    default: "NurulQuran.info | Quran, Duas, Prayer Times and Islamic Tools",
    template: "%s | NurulQuran.info",
  },
  description:
    "Read and listen to the Quran, study duas and hadith, check prayer times, find Qibla, and use Islamic spiritual tools on NurulQuran.info.",
  keywords: [
    "Quran",
    "Islamic app",
    "Dua",
    "Hadith",
    "Prayer times",
    "Qibla",
    "Asmaul Husna",
    "NurulQuran",
  ],
  openGraph: {
    title: "NurulQuran.info",
    description:
      "A reliable Islamic platform for Quran reading, duas, hadith, prayer times, Qibla, and spiritual tools.",
    url: "https://nurulquran.info",
    siteName: "NurulQuran.info",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NurulQuran.info",
    description:
      "Read Quran, duas and hadith, check prayer times, and use Islamic spiritual tools.",
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${amiri.variable}`}>
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
