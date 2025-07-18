"use client";

import { useEffect, useState, useCallback } from "react";

interface UseImagePreloaderProps {
  framePrefix: string;
  totalFrames: number;
  startFrame?: number;
  frameExtension: string;
  preloadAhead?: number;
  onFirstFrameLoad?: (image: HTMLImageElement) => void;
}

export function useImagePreloader({
  framePrefix,
  totalFrames,
  startFrame = 1,
  frameExtension,
  preloadAhead = 5,
  onFirstFrameLoad,
}: UseImagePreloaderProps) {
  const [loadedImages, setLoadedImages] = useState<
    Map<number, HTMLImageElement>
  >(new Map());
  const [currentFrame, setCurrentFrame] = useState(startFrame);
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);

  const getFramePath = useCallback(
    (frameNumber: number) => {
      const paddedNumber = frameNumber.toString().padStart(4, "0");
      return `/ezgif-split/${framePrefix}${paddedNumber}.${frameExtension}`;
    },
    [framePrefix, frameExtension],
  );

  const preloadImage = useCallback(
    (frameNumber: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        if (loadedImages.has(frameNumber)) {
          resolve(loadedImages.get(frameNumber)!);
          return;
        }

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          setLoadedImages((prev) => new Map(prev).set(frameNumber, img));
          if (frameNumber === startFrame && !firstFrameLoaded) {
            setFirstFrameLoaded(true);
            if (onFirstFrameLoad) {
              onFirstFrameLoad(img);
            }
          }
          resolve(img);
        };
        img.onerror = reject;
        img.src = getFramePath(frameNumber);
      });
    },
    [getFramePath, loadedImages, firstFrameLoaded, onFirstFrameLoad, startFrame],
  );

  const preloadFrames = useCallback(
    async (startFrameNumber: number, count: number) => {
      const promises: Promise<HTMLImageElement>[] = [];
      for (let i = 0; i < count; i++) {
        const frameNumber = startFrameNumber + i;
        if (frameNumber >= 1 && frameNumber <= totalFrames) {
          promises.push(preloadImage(frameNumber));
        }
      }
      try {
        await Promise.all(promises);
      } catch (error) {
        console.warn("Failed to preload some frames:", error);
      }
    },
    [preloadImage, totalFrames],
  );

  useEffect(() => {
    // Preload initial frames
    preloadFrames(startFrame, Math.min(10, totalFrames));
  }, [preloadFrames, totalFrames, startFrame]);

  useEffect(() => {
    // Preload frames ahead of current frame
    const startFrameNumber = Math.max(startFrame, currentFrame);
    const endFrame = Math.min(totalFrames, currentFrame + preloadAhead);
    if (endFrame > startFrameNumber) {
      preloadFrames(startFrameNumber, endFrame - startFrameNumber + 1);
    }
  }, [currentFrame, preloadFrames, preloadAhead, totalFrames, startFrame]);

  const getCurrentImage = useCallback(
    (frameNumber: number) => {
      const clampedFrame = Math.max(
        1,
        Math.min(totalFrames, Math.round(frameNumber)),
      );
      return loadedImages.get(clampedFrame) || null;
    },
    [loadedImages, totalFrames],
  );

  return {
    getCurrentImage,
    getFramePath,
    setCurrentFrame,
    loadedImages,
    totalLoadedFrames: loadedImages.size,
  };
}
