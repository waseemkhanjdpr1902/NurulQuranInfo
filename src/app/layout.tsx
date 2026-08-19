import type { Metadata } from "next";
import { Inter, Playfair_Display, Amiri } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-arabic" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nurrulquraninfo.vercel.app"),
  title: {
    default: "NurulQuran — Quran Reading, Tafsir & Daily Islamic Tools",
    template: "%s | NurulQuran",
  },
  description: "Read and listen to the Quran, study tafsir, check prayer times, use daily duas and access practical Islamic tools.",
  applicationName: "NurulQuran",
  manifest: "/manifest.json",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "NurulQuran — Light for the Soul",
    description: "Quran reading, tafsir and practical daily Islamic tools in one respectful study experience.",
    siteName: "NurulQuran",
  },
  robots: { index: true, follow: true },
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
