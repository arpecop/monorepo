import type React from "react";
import "./globals.css";
import { tabs } from "@/lib/markdownContent";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BootScreen from "@/components/boot-screen";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <BootScreen />
        {children}
        <div className="sr-only">
          {tabs.map((tab) => (
            tab.type === "markdown" && (
              <ReactMarkdown key={tab.id} remarkPlugins={[remarkGfm]}>
                {tab.content}
              </ReactMarkdown>
            )
          ))}
        </div>
      </body>
    </html>
  );
}
