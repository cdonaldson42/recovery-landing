import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import LottiePreloader from "@/components/LottiePreloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Routine Checklist",
  description: "A fun daily routine tracker for kids",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <LottiePreloader />
        {children}
      </body>
    </html>
  );
}
