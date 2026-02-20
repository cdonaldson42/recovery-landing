"use client";

import { useEffect } from "react";
import { getTodayTheme } from "@/lib/dailyTheme";

export default function LottiePreloader() {
  useEffect(() => {
    const theme = getTodayTheme();
    const urls = theme.animals
      .map((a) => a.lottieSrc)
      .filter((url) => url.length > 0);

    urls.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = url;
      link.as = "fetch";
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });
  }, []);

  return null;
}
