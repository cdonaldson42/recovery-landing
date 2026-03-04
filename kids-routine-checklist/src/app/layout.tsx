import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import LottiePreloader from "@/components/LottiePreloader";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
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
        className={`${nunito.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <LottiePreloader />
        {children}
      </body>
    </html>
  );
}
