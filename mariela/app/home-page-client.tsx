"use client";

import { ImageSequenceSection } from "@/components/image-sequence-section";
import { StaticSection } from "@/components/static-section";
import { sequenceConfig } from "@/config/sequences";
import { ImageSequenceConfig } from "@/types/config";

export function HomePageClient() {
  return (
    <div className="bg-black">
      {/* Image Sequence Sections */}
      {sequenceConfig.sequences
        .filter((sequence) => !sequence.type)
        .map((sequence) => (
          <ImageSequenceSection
            key={sequence.id}
            config={sequence as ImageSequenceConfig}
          />
        ))}

      {/* Static Content Section */}
      <StaticSection />
    </div>
  );
}