import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ApolloWrapper } from "@/lib/apollo-provider";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://renewz.org';

export const metadata: Metadata = {
  title: "Renewz.org",
  description: "Professional articles and insights",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Renewz.org",
    description: "Professional articles and insights",
    url: siteUrl,
    siteName: "Renewz.org",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Renewz.org",
    description: "Professional articles and insights",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-R19W71CXZQ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-R19W71CXZQ');
            `,
          }}
        />
        <meta name="google-site-verification" content="YOCdIIYfkSZxafqOqjVfUnsoHebuPB4PIH0SGISDNyQ" />
        <meta name="google-adsense-account" content="ca-pub-5476404733919333" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Playfair+Display:wght@400..900&family=Fira+Code:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <ApolloWrapper>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </ApolloWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
