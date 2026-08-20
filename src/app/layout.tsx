import type { Metadata } from "next";
import { Inter, Playfair_Display, Amiri } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-arabic" });

export const metadata: Metadata = {
  title: {
    default: "NurulQuran — Read, Reflect and Remember",
    template: "%s | NurulQuran",
  },
  description: "Read the Holy Quran, explore tafseer and authentic Islamic resources, and use practical tools for prayer, duas, tasbih and zakat.",
  applicationName: "NurulQuran",
  keywords: ["Quran", "Holy Quran", "Tafseer", "Islamic tools", "Dua", "Prayer times"],
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
