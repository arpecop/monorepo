import { HomePageClient } from "./home-page-client";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Езо Нутрициология",
    description:
      "Открийте иновативни преживявания, които разширяват границите на възможното.",
  };
}

export default function Page() {
  return <HomePageClient />;
}