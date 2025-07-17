export interface TextSlide {
  id: string;
  text: string;
  subtitle?: string | string[];
  slideIndex?: number;
  position?: "center" | "left" | "right" | "top" | "bottom";
  style?: "heading" | "body" | "caption";
  buttonText?: string;
  buttonHref?: string;
  imageUrl?: string;
}

export interface ImageSequenceConfig {
  id: string;
  type?: "static";
  framePrefix: string;
  totalFrames: number;
  frameExtension: string;
  title: string;
  description: string;
  scrollMultiplier: number;
  totalSlides: number;
  preloadAhead?: number;
  startFrame?: number;
  showDevInfo?: boolean;
  overlayClassName?: string;
  textSlides: TextSlide[];
}

export interface AppConfig {
  globalSettings: {
    defaultScrollMultiplier: number;
    theme: "light" | "dark";
  };
  sequences: ImageSequenceConfig[];
}