"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import type { ImageSequenceConfig, TextSlide } from "@/types/video-config";
import { getAnimationVariants } from "./animation-variants";
import { useImagePreloader } from "@/hooks/use-image-preloader";

interface ImageSequenceSectionProps {
  config: ImageSequenceConfig;
}

export function ImageSequenceSection({ config }: ImageSequenceSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sequenceEnded, setSequenceEnded] = useState(false);
  const [currentFrameNumber, setCurrentFrameNumber] = useState(1);
  const [animatedSlides, setAnimatedSlides] = useState<Set<string>>(new Set());

  const scrollHeight =
    (config.totalFrames / 30) * (config.scrollMultiplier || 150); // Assuming 30fps equivalent

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const frameProgress = useTransform(
    smoothScrollYProgress,
    [0, 1],
    [1, config.totalFrames],
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

  const { getCurrentImage, setCurrentFrame, totalLoadedFrames } =
    useImagePreloader({
      framePrefix: config.framePrefix,
      totalFrames: config.totalFrames,
      frameExtension: config.frameExtension,
      preloadAhead: config.preloadAhead || 5,
      onFirstFrameLoad: drawImage,
    });

  useEffect(() => {
    const firstImage = getCurrentImage(1);
    if (firstImage) {
      drawImage(firstImage);
    }
  }, [getCurrentImage]);

  useEffect(() => {
    const unsubscribe = frameProgress.on("change", (latest) => {
      const frameNumber = Math.max(
        1,
        Math.min(config.totalFrames, Math.round(latest)),
      );
      setCurrentFrameNumber(frameNumber);
      setCurrentFrame(frameNumber);

      const img = getCurrentImage(frameNumber);
      if (img) {
        drawImage(img);
      }

      if (frameNumber >= config.totalFrames - 1) {
        setSequenceEnded(true);
      } else {
        setSequenceEnded(false);
      }
    });

    return unsubscribe;
  }, [frameProgress, getCurrentImage, setCurrentFrame, config.totalFrames]);

  const extraclasses = ""; // Removed bg-black/40 and rounded-lg
  const getPositionClasses = (position: TextSlide["position"]) => {
    switch (position) {
      case "left":
        return "left-8 top-1/2 -translate-y-1/2 text-left " + extraclasses;
      case "right":
        return "right-8 top-1/2 -translate-y-1/2 text-right " + extraclasses;
      case "top":
        return "top-8 left-1/2 -translate-x-1/2 text-center " + extraclasses;
      case "bottom":
        return (
          "bottom-8 left-1/2 -translate-x-1/2 text-center   " + extraclasses
        );
      default:
        return (
          "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center " +
          extraclasses
        );
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

  const calculateSlidePosition = (slideIndex: number, totalSlides: number) => {
    if (totalSlides <= 1) return 50;

    const padding = 10;
    const availableSpace = 100 - padding * 2;
    const slideSpacing = availableSpace / (totalSlides - 1);

    return padding + slideIndex * slideSpacing;
  };

  const renderAnimatedText = (slide: TextSlide) => {
    const animation = slide.animation || {
      enter: "fade",
      exit: "fade",
      duration: 0.8,
      delay: 0,
      stagger: 0,
    };

    const variants = getAnimationVariants(
      animation.enter,
      animation.exit,
      animation.duration || 0.8,
      animation.delay || 0,
      animation.stagger || 0,
    );

    const topPosition = calculateSlidePosition(
      slide.slideIndex,
      config.totalSlides,
    );
    const isAnimated = animatedSlides.has(slide.id);

    const handleViewportEnter = () => {
      if (!isAnimated) {
        setAnimatedSlides((prev) => new Set(prev).add(slide.id));
      }
    };

    const isSidePosition =
      slide.position === "left" || slide.position === "right";

    const textContent = (
      <div className={isSidePosition ? "max-w-md" : ""}>
        <h2 className={getStyleClasses(slide.style)}>{slide.text}</h2>
        {slide.subtitle && (
          <p className="text-lg md:text-xl text-gray-300 mt-2">
            {slide.subtitle}
          </p>
        )}
        {slide.buttonText && slide.buttonHref && (
          <motion.a
            href={slide.buttonHref}
            className="mt-4 inline-block bg-white text-black px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-200 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isAnimated ? 1 : 0, y: isAnimated ? 0 : 20 }}
            transition={{ duration: 0.8, delay: (animation.delay || 0) + 0.4 }}
          >
            {slide.buttonText}
          </motion.a>
        )}
      </div>
    );

    const imageContent = slide.imageUrl && (
      <motion.img
        src={slide.imageUrl}
        alt={slide.text}
        className="w-64 h-64 object-contain"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isAnimated ? 1 : 0,
          scale: isAnimated ? 1 : 0.8,
        }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    );

    return (
      <motion.div
        key={slide.id}
        className={`absolute ${getPositionClasses(slide.position)} text-white z-10 w-full ${isSidePosition ? "flex items-center gap-8" : "flex flex-col items-center gap-4"}`}
        style={{ top: `${topPosition}%` }}
        initial="initial"
        animate={isAnimated ? "animate" : "initial"}
        variants={variants}
        onViewportEnter={handleViewportEnter}
        viewport={{ once: true, margin: "-20%" }}
      >
        {isSidePosition ? (
          <>
            {slide.position === "left" && textContent}
            {slide.position === "left" && imageContent}
            {slide.position === "right" && imageContent}
            {slide.position === "right" && textContent}
          </>
        ) : (
          <>
            {textContent}
            {imageContent}
          </>
        )}
      </motion.div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${scrollHeight}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden ">
        <div className="relative w-full h-full">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
            style={{ width: "100vw", height: "100vh" }}
          />
          {config.overlayClassName && (
            <div className={`absolute inset-0 ${config.overlayClassName}`} />
          )}

          <div className="absolute inset-x-0 top-0 h-[250px] bg-gradient-to-b from-black to-transparent z-10"></div>

          {config.showDevInfo && (
            <>
              {/* Progress Indicator */}
              <motion.div
                className="absolute bottom-8 left-8 right-8 h-1 bg-white/20 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="h-full bg-white rounded-full"
                  style={{
                    scaleX: scrollYProgress,
                    transformOrigin: "left",
                  }}
                />
              </motion.div>

              {/* Frame Counter */}
              <motion.div
                className="absolute top-8 right-8 text-white text-sm font-mono z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div>
                  Frame {currentFrameNumber} / {config.totalFrames}
                </div>
                <div className="text-xs text-gray-400">
                  Loaded: {totalLoadedFrames}
                </div>
              </motion.div>

              {/* Sequence End Overlay */}
              <motion.div
                className="absolute inset-0 bg-black/50 flex items-center justify-center z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: sequenceEnded ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-white text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: sequenceEnded ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: sequenceEnded ? 1 : 0,
                      y: sequenceEnded ? 0 : 20,
                    }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-lg"
                  >
                    {config.title} Complete
                  </motion.p>
                </div>
              </motion.div>
            </>
          )}

          {/* Sequence Info */}
          <motion.div
            className="absolute top-8 left-8 text-white z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-xl font-medium">{config.title}</h3>
            {config.description && (
              <p className="text-sm text-gray-300 mt-1">{config.description}</p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Absolutely Positioned Text Slides */}
      <div className="absolute inset-0 pointer-events-none">
        {config.textSlides.map((slide) => renderAnimatedText(slide))}
      </div>
    </div>
  );
}
