"use client";
import { motion } from "framer-motion";
import { sequenceConfig } from "@/config/sequences";
import { ImageSequenceConfig } from "@/types/config";

export function StaticSection() {
  const staticContent = sequenceConfig.sequences.find(
    (seq) => seq.type === "static"
  ) as ImageSequenceConfig | undefined;

  if (!staticContent) {
    return null;
  }

  return (
    <div id="contact" className="z-20">
      <motion.section
        id="static-content"
        className="min-h-screen bg-white text-black flex items-center justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="text-center max-w-4xl mx-auto px-4 z-10">
          <motion.h2
            className="text-5xl md:text-7xl font-thin mb-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {staticContent.title}
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {staticContent.description}
          </motion.p>
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {staticContent.textSlides.map((slide) => (
              <motion.div
                key={slide.id}
                className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-gray-600">{slide.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}