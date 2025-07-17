import type React from "react";
import type { Metadata } from "next";
import { Playfair } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const geistMono = Playfair({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Max Wire News - Your Trusted Source for Breaking News",
  description:
    "Stay informed with Max Wire News. Get the latest breaking news, in-depth analysis, and expert commentary on politics, business, technology, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.variable} antialiased overflow-x-hidden`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
//   <Header />
//   <main>{children}</main>
//   <Footer />
// </ThemeProvider>
