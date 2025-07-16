"use client";

import { motion } from "framer-motion";
import { ImageSequenceSection } from "@/components/image-sequence-section";
import { sequenceConfig } from "@/config/sequences";

export function HomePageClient() {
  const totalSequences = sequenceConfig.sequences.length;

  return (
    <div className="bg-black">
      {/* Hero Section */}

      <section
        id="начало"
        className="relative h-screen flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: `url('/ezgif-split/out_001x.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
        }}
      >
        
        <div className="text-center z-10">
          <motion.h1
            className="text-6xl md:text-8xl font-thin mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            езо
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            нутрициология
          </motion.p>
          <motion.div
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Общо кадри:{" "}
            {sequenceConfig.sequences.reduce(
              (acc, seq) => acc + seq.totalFrames,
              0,
            )}
          </motion.div>
        </div>
      </section>

      {/* Image Sequence Sections */}
      {sequenceConfig.sequences.map((sequence) => (
        <ImageSequenceSection key={sequence.id} config={sequence} />
      ))}

      {/* Услуги Section */}
      <div className="z-20">
        <motion.section
          id="услуги"
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
              Нашите Услуги
            </motion.h2>
            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Открийте персонализирани хранителни планове и експертни съвети за по-добро здраве.
            </motion.p>
            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {[
                { title: "Персонализирани Планове", desc: "Съобразени с вашите нужди" },
                { title: "Експертни Консултации", desc: "Индивидуален подход" },
                {
                  title: "Цялостен Подход",
                  desc: "Трайно здраве и енергия",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-2xl font-medium mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Footer */}
        <section className="h-screen bg-black text-white flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-6xl font-thin mb-4">
              Благодаря Ви!
            </h3>
            <p className="text-gray-400">
              За преживяването на нашите {totalSequences}{" "}
              {totalSequences === 1 ? "последователност" : "последователности"}
            </p>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
