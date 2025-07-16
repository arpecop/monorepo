export interface TextSlide {
  id: string;
  text: string;
  subtitle?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonHref?: string;
  position: "center" | "left" | "right" | "top" | "bottom";
  style?: "heading" | "body" | "caption";
  slideIndex: number;
  animation?: {
    enter: AnimationType;
    exit: AnimationType;
    duration?: number;
    delay?: number;
    stagger?: number;
  };
}

export type AnimationType =
  | "fade"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scale"
  | "rotate"
  | "bounce"
  | "blur"
  | "flip";

export interface ImageSequenceConfig {
  id: string;
  framePrefix: string;
  totalFrames: number;
  startFrame?: number;
  frameExtension: string;
  title: string;
  description?: string;
  textSlides: TextSlide[];
  totalSlides: number;
  scrollMultiplier?: number;
  preloadAhead?: number;
  showDevInfo?: boolean;
  overlayClassName?: string;
}



export interface AppConfig {
  sequences: ImageSequenceConfig[];
  globalSettings: {
    defaultScrollMultiplier: number;
    theme: "dark" | "light";
    defaultAnimation: {
      enter: AnimationType;
      exit: AnimationType;
      duration: number;
    };
  };
}