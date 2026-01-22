import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ApolloWrapper } from "@/lib/apollo-provider";
import { Navbar } from "./components/Navbar";

export const metadata: Metadata = {
  title: "Articles",
  description: "Professional articles and insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="YOCdIIYfkSZxafqOqjVfUnsoHebuPB4PIH0SGISDNyQ" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Playfair+Display:wght@400..900&family=Fira+Code:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <ApolloWrapper>
            <Navbar />
            {children}
          </ApolloWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
