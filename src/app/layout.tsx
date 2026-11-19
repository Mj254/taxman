import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kenya Tax Calculator — KRA PAYE, Business & VAT",
  description: "Calculate personal income tax (PAYE), business income tax, and VAT using the latest Kenya Revenue Authority rates and reliefs.",
  keywords: ["KRA", "Kenya tax", "PAYE calculator", "corporate tax Kenya", "VAT Kenya", "NSSF", "SHIF", "housing levy"],
  authors: [{ name: "Kenya Tax Calculator" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Kenya Tax Calculator",
    description: "Personal & business income tax calculator using KRA rates",
    siteName: "Kenya Tax Calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenya Tax Calculator",
    description: "Personal & business income tax calculator using KRA rates",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
