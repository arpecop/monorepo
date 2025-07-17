"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { ImageSequenceConfig, TextSlide } from "@/types/config";
import { useImagePreloader } from "@/hooks/use-image-preloader";

interface ImageSequenceSectionProps {
  config: ImageSequenceConfig;
}

function Slide({ slide }: { slide: TextSlide }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["100%", "-100%"]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0, 1, 1, 0]
  );

  const getPositionClasses = (position: TextSlide["position"]) => {
    switch (position) {
      case "left":
        return "items-start text-left";
      case "right":
        return "items-end text-right";
      default:
        return "items-center text-center";
    }
  };

  const getStyleClasses = (style: TextSlide["style"]) => {
    switch (style) {
      case "heading":
        return "text-4xl md:text-6xl font-thin";
      case "body":
        return "text-lg md:text-xl font-normal";
      case "caption":
        return "text-sm md:text-base font-light";
      default:
        return "text-2xl md:text-4xl font-normal";
    }
  };

  return (
    <div
      ref={ref}
      className={`h-screen w-full flex flex-col justify-center p-8 ${getPositionClasses(
        slide.position
      )}`}
    >
      <motion.div style={{ x, opacity }} className="max-w-2xl">
        <h2 className={getStyleClasses(slide.style)}>{slide.text}</h2>
        {slide.subtitle && (
          <p className="text-lg md:text-xl text-gray-300 mt-2">
            {slide.subtitle}
          </p>
        )}
      </motion.div>
    </div>
  );
}

export function ImageSequenceSection({ config }: ImageSequenceSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scrollHeight = config.totalSlides * 100; // Each slide gets 100vh

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameProgress = useTransform(
    scrollYProgress,
    [0, 1],
    [config.startFrame || 1, config.totalFrames]
  );

  const drawImage = (image: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = image.width || 800;
    canvas.height = image.height || 600;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  };

  const { getCurrentImage, setCurrentFrame } = useImagePreloader({
    framePrefix: config.framePrefix,
    totalFrames: config.totalFrames,
    startFrame: config.startFrame,
    frameExtension: config.frameExtension,
    preloadAhead: config.preloadAhead || 5,
    onFirstFrameLoad: drawImage,
  });

  useEffect(() => {
    const firstImage = getCurrentImage(config.startFrame || 1);
    if (firstImage) {
      drawImage(firstImage);
    }
  }, [getCurrentImage, config.startFrame]);

  useEffect(() => {
    const unsubscribe = frameProgress.on("change", (latest) => {
      const frameNumber = Math.max(
        1,
        Math.min(config.totalFrames, Math.round(latest))
      );
      setCurrentFrame(frameNumber);
      const img = getCurrentImage(frameNumber);
      if (img) {
        drawImage(img);
      }
    });

    return unsubscribe;
  }, [frameProgress, getCurrentImage, setCurrentFrame, config.totalFrames]);

  return (
    <div
      ref={containerRef}
      className="relative text-white"
      style={{ height: `${scrollHeight}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
          style={{ width: "100vw", height: "100vh" }}
        />
        {config.overlayClassName && (
          <div className={`absolute inset-0 ${config.overlayClassName}`} />
        )}
      </div>

      {config.textSlides.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute top-0 left-0 w-full"
          style={{
            height: "100vh",
            top: `${index * 100}vh`,
          }}
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            <Slide slide={slide} />
          </div>
        </div>
      ))}
    </div>
  );
}