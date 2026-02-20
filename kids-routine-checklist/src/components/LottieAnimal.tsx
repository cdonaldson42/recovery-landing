"use client";

import { useState, useCallback } from "react";
import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react";

interface LottieAnimalProps {
  src: string;
  fallbackEmoji: string;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  speed?: number;
}

export default function LottieAnimal({
  src,
  fallbackEmoji,
  className = "",
  autoplay = true,
  loop = false,
  speed = 1,
}: LottieAnimalProps) {
  const [failed, setFailed] = useState(!src);

  const dotLottieRefCallback = useCallback((dotLottie: DotLottie | null) => {
    if (dotLottie) {
      dotLottie.addEventListener("loadError", () => setFailed(true));
    }
  }, []);

  if (failed) {
    return (
      <div className={className} role="img" aria-label={fallbackEmoji}>
        <span className="block w-full h-full text-center leading-[1]" style={{ fontSize: "inherit" }}>
          {fallbackEmoji}
        </span>
      </div>
    );
  }

  return (
    <DotLottieReact
      src={src}
      autoplay={autoplay}
      loop={loop}
      speed={speed}
      className={className}
      dotLottieRefCallback={dotLottieRefCallback}
    />
  );
}
