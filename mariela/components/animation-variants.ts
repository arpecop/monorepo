"use client"

import type { Variants, TargetAndTransition } from "framer-motion"

export const getAnimationVariants = (
  enterType: string,
  exitType: string,
  duration = 0.8,
  delay = 0,
  stagger = 0,
): Variants => {
  const enterVariants: Record<string, TargetAndTransition> = {
    fade: { opacity: 0 },
    slideUp: { opacity: 0, y: 50 },
    slideDown: { opacity: 0, y: -50 },
    slideLeft: { opacity: 0, x: 50 },
    slideRight: { opacity: 0, x: -50 },
    scale: { opacity: 0, scale: 0.8 },
    rotate: { opacity: 0, rotate: -10 },
    bounce: { opacity: 0, scale: 0.3, y: 30 },
    
    blur: { opacity: 0, filter: "blur(10px)" },
    flip: { opacity: 0, rotateY: -90 },
  }

  const animateVariants: Record<string, TargetAndTransition> = {
    fade: { opacity: 1 },
    slideUp: { opacity: 1, y: 0 },
    slideDown: { opacity: 1, y: 0 },
    slideLeft: { opacity: 1, x: 0 },
    slideRight: { opacity: 1, x: 0 },
    scale: { opacity: 1, scale: 1 },
    rotate: { opacity: 1, rotate: 0 },
    bounce: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
        duration,
      },
    },
    
    blur: { opacity: 1, filter: "blur(0px)" },
    flip: { opacity: 1, rotateY: 0 },
  }

  return {
    initial: enterVariants[enterType] || enterVariants.fade,
    animate: {
      ...(animateVariants[enterType] || animateVariants.fade),
      transition: {
        duration,
        delay,
        staggerChildren: stagger,
        ease: "easeOut",
      },
    },
  }
}

export const getTextVariants = (stagger = 0): Variants => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren: 0.1,
    },
  },
})

export const getCharVariants = (): Variants => ({
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
})
