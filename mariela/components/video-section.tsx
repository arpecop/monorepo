"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import type { VideoConfig, TextSlide } from "@/types/video-config"
import { getAnimationVariants, getTextVariants, getCharVariants } from "./animation-variants"

interface VideoSectionProps {
  config: VideoConfig
  index: number
}

export function VideoSection({ config }: VideoSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [animatedSlides, setAnimatedSlides] = useState<Set<string>>(new Set())

  const scrollHeight = config.duration * (config.scrollMultiplier || 150)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const videoTime = useTransform(scrollYProgress, [0, 1], [0, config.duration])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoLoaded) return

    const unsubscribe = videoTime.on("change", (latest) => {
      if (video && !isNaN(latest)) {
        const clampedTime = Math.min(latest, video.duration || config.duration)
        video.currentTime = clampedTime
        setCurrentTime(clampedTime)

        if (latest >= (video.duration || config.duration) - 0.1) {
          setVideoEnded(true)
        } else {
          setVideoEnded(false)
        }
      }
    })

    return unsubscribe
  }, [videoTime, videoLoaded, config.duration])

  const handleVideoLoad = () => {
    setVideoLoaded(true)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  const getPositionClasses = (position: TextSlide["position"]) => {
    switch (position) {
      case "left":
        return "left-8 top-1/2 -translate-y-1/2 text-left max-w-md"
      case "right":
        return "right-8 top-1/2 -translate-y-1/2 text-right max-w-md"
      case "top":
        return "top-8 left-1/2 -translate-x-1/2 text-center max-w-2xl"
      case "bottom":
        return "bottom-8 left-1/2 -translate-x-1/2 text-center max-w-2xl"
      default:
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-2xl"
    }
  }

  const getStyleClasses = (style: TextSlide["style"]) => {
    switch (style) {
      case "heading":
        return "text-4xl md:text-6xl font-thin"
      case "body":
        return "text-lg md:text-xl font-normal"
      case "caption":
        return "text-sm md:text-base font-light"
      default:
        return "text-2xl md:text-4xl font-normal"
    }
  }

  // Calculate the top position for each slide based on its index
  const calculateSlidePosition = (slideIndex: number, totalSlides: number) => {
    if (totalSlides <= 1) return 50 // Center if only one slide

    // Distribute slides evenly throughout the scroll height
    // Leave some padding at top and bottom
    const padding = 10 // 10% padding at top and bottom
    const availableSpace = 100 - padding * 2
    const slideSpacing = availableSpace / (totalSlides - 1)

    return padding + slideIndex * slideSpacing
  }

  const renderAnimatedText = (slide: TextSlide) => {
    const animation = slide.animation || {
      enter: "fade",
      exit: "fade",
      duration: 0.8,
      delay: 0,
      stagger: 0,
    }

    const variants = getAnimationVariants(
      animation.enter,
      animation.exit,
      animation.duration || 0.8,
      animation.delay || 0,
      animation.stagger || 0,
    )

    const topPosition = calculateSlidePosition(slide.slideIndex, config.totalSlides)
    const isAnimated = animatedSlides.has(slide.id)

    const handleViewportEnter = () => {
      if (!isAnimated) {
        setAnimatedSlides((prev) => new Set(prev).add(slide.id))
      }
    }

    

    if (animation.stagger && animation.stagger > 0) {
      return (
        <motion.div
          key={slide.id}
          className={`absolute ${getPositionClasses(slide.position)} text-white z-10`}
          style={{ top: `${topPosition}%` }}
          initial="initial"
          animate={isAnimated ? "animate" : "initial"}
          variants={getTextVariants(animation.stagger)}
          onViewportEnter={handleViewportEnter}
          viewport={{ once: true, margin: "-20%" }}
        >
          <motion.h2 className={getStyleClasses(slide.style)}>
            {slide.text.split("").map((char, index) => (
              <motion.span key={index} variants={getCharVariants()}>
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h2>
          {slide.subtitle && (
            <motion.p className="text-lg md:text-xl text-gray-300 mt-2">
              {slide.subtitle.split("").map((char, index) => (
                <motion.span key={index} variants={getCharVariants()}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.p>
          )}
        </motion.div>
      )
    }

    return (
      <motion.div
        key={slide.id}
        className={`absolute ${getPositionClasses(slide.position)} text-white z-10`}
        style={{ top: `${topPosition}%` }}
        initial="initial"
        animate={isAnimated ? "animate" : "initial"}
        variants={variants}
        onViewportEnter={handleViewportEnter}
        viewport={{ once: true, margin: "-20%" }}
      >
        <h2 className={getStyleClasses(slide.style)}>{slide.text}</h2>
        {slide.subtitle && <p className="text-lg md:text-xl text-gray-300 mt-2">{slide.subtitle}</p>}
      </motion.div>
    )
  }

  return (
    <div ref={containerRef} className="relative" style={{ height: `${scrollHeight}vh` }}>
      {/* Sticky Video Container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-black">
        <motion.div
          className="relative w-full max-w-6xl mx-auto px-4"
          style={{
            scale: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.8, 1, 1, 0.8]),
            opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.5, 1, 1, 0.5]),
          }}
        >
          <video
            ref={videoRef}
            className="w-full h-auto rounded-2xl shadow-2xl"
            muted
            playsInline
            preload="metadata"
            onLoadedData={handleVideoLoad}
            crossOrigin="anonymous"
          >
            <source src={config.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video Progress Indicator */}
          <motion.div
            className="absolute bottom-4 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: videoLoaded ? 1 : 0 }}
          >
            <motion.div
              className="h-full bg-white rounded-full"
              style={{
                scaleX: scrollYProgress,
                transformOrigin: "left",
              }}
            />
          </motion.div>

          {/* Video Info */}
          <motion.div
            className="absolute top-4 left-4 text-white z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: videoLoaded ? 1 : 0 }}
          >
            <h3 className="text-xl font-medium">{config.title}</h3>
            {config.description && <p className="text-sm text-gray-300 mt-1">{config.description}</p>}
          </motion.div>

          {/* Time Display */}
          <motion.div
            className="absolute top-4 right-4 text-white text-sm font-mono z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: videoLoaded ? 1 : 0 }}
          >
            {Math.floor(currentTime)}s / {config.duration}s
          </motion.div>

          {/* Video End Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: videoEnded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: videoEnded ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: videoEnded ? 1 : 0, y: videoEnded ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-lg"
              >
                {config.title} Complete
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Absolutely Positioned Text Slides */}
      <div className="absolute inset-0 pointer-events-none">
        {config.textSlides.map((slide) => renderAnimatedText(slide))}
      </div>
    </div>
  )
}
