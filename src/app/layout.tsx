import type { Metadata } from "next";
import { Inter, Playfair_Display, Amiri } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-arabic" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nurrulquran.info"),
  title: {
    default: "NurulQuran — Read, Reflect and Remember",
    template: "%s | NurulQuran",
  },
  description: "Read the Holy Quran, explore tafseer and authentic Islamic resources, and use practical tools for prayer, duas, tasbih and zakat.",
  applicationName: "NurulQuran",
  keywords: ["Quran", "Holy Quran", "Tafseer", "Islamic tools", "Dua", "Prayer times"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "NurulQuran",
    title: "NurulQuran — Read, Reflect and Remember",
    description: "Read the Holy Quran, explore tafseer and use practical Islamic tools in a calm, accessible experience.",
  },
  twitter: {
    card: "summary",
    title: "NurulQuran — Read, Reflect and Remember",
    description: "Read the Holy Quran, explore tafseer and use practical Islamic tools.",
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
        {children}
      </body>
    </html>
  );
}
