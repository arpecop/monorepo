import { HomePageClient } from "./home-page-client";
import type { Metadata } from "next";
import { sequenceConfig } from "@/config/sequences";
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Езо Нутрициология",
    description:
      "Открийте иновативни преживявания, които разширяват границите на възможното.",
  };
}

export default function Page() {
  return (
    <>
      <HomePageClient />
      <div className="hidden">
        {sequenceConfig.sequences.map((sequence) => (
          <div key={sequence.id}>{sequence.title}</div>
        ))}
      </div>
    </>
  );
}
