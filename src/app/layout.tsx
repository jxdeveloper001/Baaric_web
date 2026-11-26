import type { Metadata } from "next";
import { Hind_Siliguri, Noto_Sans_Bengali, Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";

const serifBn = Noto_Serif_Bengali({
  variable: "--font-serif-bn",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

const displayBn = Noto_Sans_Bengali({
  variable: "--font-display-bn",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const sansBn = Hind_Siliguri({
  variable: "--font-sans-bn",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Baaric — শিশুর কোমল যত্নের প্রাকৃতিক তেল",
  description:
    "Baaric — শিশুর ত্বক ও চুলের জন্য কোমল, প্রাকৃতিক বেবি অয়েল। ম্যাসাজ অয়েল, হেয়ার অয়েল আর কোল্ড-প্রেসড কোকোনাট অয়েল।",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" className={`${serifBn.variable} ${displayBn.variable} ${sansBn.variable}`}>
      <body className="min-h-screen bg-white font-sans text-ink-soft antialiased">
        {children}
      </body>
    </html>
  );
}
