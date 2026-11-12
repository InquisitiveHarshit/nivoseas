"use client";

import { useEffect, useRef, useState } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  aspectRatio?: string;
  speed?: number; // parallax travel intensity, e.g. 24px
  scale?: number;
}

export default function ParallaxImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  aspectRatio = "1/1",
  speed = 28,
  scale = 1.14,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const calculateParallax = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only calculate if within or near viewport
      if (rect.bottom >= -100 && rect.top <= windowHeight + 100) {
        // -1 when at top of viewport, +1 when at bottom
        const progress = (rect.top - windowHeight / 2) / (windowHeight / 2);
        const clamped = Math.max(-1.2, Math.min(1.2, progress));
        setOffsetY(clamped * speed);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(calculateParallax);
        ticking = true;
      }
    };

    calculateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover will-change-transform transition-transform duration-300 ease-out group-hover:scale-[1.05] ${imgClassName}`}
        style={{
          transform: `scale(${scale}) translate3d(0, ${offsetY}px, 0)`,
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.opacity = "0";
        }}
      />
    </div>
  );
}

