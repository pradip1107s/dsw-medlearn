import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "DSW Med-Learn | Dr. Sagathiya Wellness Platform",
  description:
    "India's #1 Homeopathy Ed-Tech Platform — AI study assistant, 500+ MCQs, digital library, Kent repertory, case management & live doctor consultations for BHMS students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable} antialiased`}
        style={{ background: "#0d2b1f", color: "#f5f0e8", margin: 0 }}
      >
        {children}
      </body>
    </html>
  );
}
