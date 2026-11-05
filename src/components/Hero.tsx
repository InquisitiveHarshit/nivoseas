"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { IMG_ON, IMG_OFF } from "@/lib/hero-images";

type Warmth = "2700K" | "3000K" | "4000K";

interface WarmthSetting {
  id: Warmth;
  label: string;
  glow: string;
  filter: string;
}

const WARMTH_MAP: Record<Warmth, WarmthSetting> = {
  "2700K": {
    id: "2700K",
    label: "Warm",
    glow: "#FFB45E",
    filter: "sepia(0.24) saturate(1.24) hue-rotate(-6deg)",
  },
  "3000K": {
    id: "3000K",
    label: "Neutral",
    glow: "#FFE4A0",
    filter: "sepia(0.10) saturate(1.08) brightness(1.03)",
  },
  "4000K": {
    id: "4000K",
    label: "Cool",
    glow: "#C8E8FF",
    filter: "hue-rotate(12deg) brightness(1.02) saturate(0.96)",
  },
};

const WARMTH_KEYS: Warmth[] = ["2700K", "3000K", "4000K"];

export default function Hero() {
  const [isOn, setIsOn] = useState(false);
  const [warmth, setWarmth] = useState<Warmth>("2700K");
  const [hintVisible, setHintVisible] = useState(true);

  // Cord pull state
  const [isDragging, setIsDragging] = useState(false);
  const [cordOffset, setCordOffset] = useState(0);
  const [isSpringing, setIsSpringing] = useState(false);
  const dragStartYRef = useRef(0);
  const currentDragYRef = useRef(0);

  // Mouse coords for radial scrim
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 40 });

  const toggleLight = useCallback(() => {
    setIsOn((prev) => !prev);
    setHintVisible(false);
  }, []);

  // Keyboard shortcut: 'L' toggles light
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        toggleLight();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleLight]);

  // Mouse move tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  // Cord pointer drag interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStartYRef.current = e.clientY;
    currentDragYRef.current = 0;
    setIsDragging(true);
    setIsSpringing(false);
  };

  // Scroll parallax for hero background image
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const delta = Math.max(0, Math.min(e.clientY - dragStartYRef.current, 100));
    currentDragYRef.current = delta;
    setCordOffset(delta);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    const finalDelta = currentDragYRef.current;
    setIsDragging(false);
    if (finalDelta > 35 || finalDelta < 6) {
      toggleLight();
    }
    setIsSpringing(true);
    setCordOffset(0);
    setTimeout(() => setIsSpringing(false), 550);
  };

  const setting = WARMTH_MAP[warmth];

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden rounded-b-[48px] sm:rounded-b-[64px] lg:rounded-b-[80px]"
      style={
        {
          "--mx": `${mousePos.x}% `,
          "--my": `${mousePos.y}% `,
          "--glow": setting.glow,
          minHeight: "580px",
          height: "min(94vh, 860px)",
        } as React.CSSProperties
      }
    >
      {/* ── Parallax Background Image Wrapper ── */}
      <div
        className="absolute inset-0 w-full h-[124%] -top-[12%] pointer-events-none will-change-transform"
        style={{
          transform: `translate3d(0, ${scrollY * 0.26}px, 0)`,
        }}
      >
        {/* ── Layer 1: Image OFF (Dark base layer) ── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={IMG_OFF}
          alt="Nivoseas Room — Unlit Chandelier"
          className="absolute inset-0 w-full h-full object-cover object-[50%_38%]"
        />

        {/* ── Layer 2: Image ON (crossfade + CCT filter) ── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={IMG_ON}
          alt="Nivoseas Room — Lit Chandelier"
          className="absolute inset-0 w-full h-full object-cover object-[50%_38%] transition-opacity duration-700 ease-in-out"
          style={{
            opacity: isOn ? 1 : 0,
            filter: setting.filter,
          }}
        />
      </div>

      {/* ── Layer 3: Dark vignette for text legibility ── */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background:
            "linear-gradient(160deg, rgba(8,6,4,0.18) 0%, rgba(8,6,4,0.52) 55%, rgba(8,6,4,0.85) 100%)",
        }}
      />
      {/* Extra bottom gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(5,4,2,0.82) 0%, rgba(5,4,2,0.32) 36%, transparent 65%)",
        }}
      />

      {/* ── Layer 4: Mouse flashlight scrim (when off) ── */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          opacity: isOn ? 0 : 1,
          background:
            "radial-gradient(circle 320px at var(--mx) var(--my), rgba(255,255,255,0.07) 0%, rgba(10,8,5,0.42) 55%, rgba(10,8,5,0.68) 100%)",
        }}
      />

      {/* ── Layer 5: Ambient glow bloom (when on) ── */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          opacity: isOn ? 0.35 : 0,
          background: `radial - gradient(ellipse 65 % 45 % at 50 % 28 %, ${setting.glow}66 0 %, transparent 72 %)`,
        }}
      />

      {/* ── Interactive Pull Cord (top-right) ── */}
      <div
        className="absolute top-0 z-30 flex flex-col items-center cursor-ns-resize group"
        style={{ right: "clamp(24px, 12vw, 140px)" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="button"
        tabIndex={0}
        aria-label="Pull cord to toggle lighting"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleLight();
          }
        }}
      >
        <div className="w-4 h-1.5 bg-[#4a4744] rounded-b-sm shadow-md" />
        <div
          className={`w - [2px] bg - gradient - to - b from - [#8c827a] to - [#d6c7b2] ${isSpringing ? "animate-spring" : ""
            } `}
          style={{
            height: `${145 + cordOffset} px`,
            transition: isDragging
              ? "none"
              : "height 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
        />
        <div
          className={`w - 3.5 h - 6 rounded - full border border - black / 30 shadow - lg cursor - pointer transition - all duration - 300 ${isOn ? "scale-105" : "bg-[#4b5563] scale-100"
            } `}
          style={{
            backgroundColor: isOn ? setting.glow : "#4b5563",
            boxShadow: isOn
              ? `0 0 16px ${setting.glow}, 0 0 32px ${setting.glow} 99`
              : "0 2px 5px rgba(0,0,0,0.4)",
          }}
        >
          <div className="w-1 h-2 bg-white/40 rounded-full mx-auto mt-1" />
        </div>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2 text-[10px] tracking-widest uppercase font-semibold text-white/80 bg-black/60 px-2 py-0.5 rounded-full pointer-events-none whitespace-nowrap backdrop-blur-sm border border-white/10">
          {isDragging ? "Release" : "Pull"}
        </span>
      </div>

      {/* ── Warmth controls + Light button (bottom-right) ── */}
      <div className="absolute bottom-10 sm:bottom-14 right-6 sm:right-10 z-20 flex flex-col items-end gap-3">
        {hintVisible && (
          <span className="text-[10px] tracking-widest uppercase font-medium text-white/70 bg-black/50 px-2.5 py-1 rounded-full whitespace-nowrap backdrop-blur-sm border border-white/10">
            Press &ldquo;L&rdquo; or pull cord to light
          </span>
        )}
          <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md p-1.5 rounded-full border border-white/15 shadow-xl">
            {WARMTH_KEYS.map((k) => {
              const isActive = k === warmth;
              const dotColor =
                k === "2700K" ? "#FFB45E" : k === "3000K" ? "#FFE4A0" : "#C8E8FF";
              return (
                <button
                  key={k}
                  onClick={() => {
                    setWarmth(k);
                    if (!isOn) setIsOn(true);
                    setHintVisible(false);
                  }}
                  className={`btn-3d flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium ${isActive
                      ? "btn-3d-glass !bg-white/25 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  aria-label={`Set color temperature to ${k}`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: dotColor,
                      boxShadow: isActive ? `0 0 8px ${dotColor} ` : "none",
                    }}
                  />
                  <span>{WARMTH_MAP[k].label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Hero Content — bottom-left, constrained to max-w-7xl ── */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col justify-end pb-12 sm:pb-16">
          <div className="max-w-[560px]">
            {/* Eyebrow */}
            <p className="text-[12px] sm:text-[13px] font-normal tracking-[0.14em] uppercase text-white/70 mb-3">
              Nivoseas Lighting — Sector 104, Noida
            </p>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-normal leading-[1.08] tracking-[-1.5px] text-white mb-3 sm:mb-4">
              Illuminate Every Space With{" "}
              <span
                className="transition-all duration-500 font-normal"
                style={{
                  color: isOn ? setting.glow : "white",
                  textShadow: isOn
                    ? `0 0 32px ${setting.glow} 99`
                    : "none",
                }}
              >
                Timeless Luxury Lighting.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-white/80 text-[15px] sm:text-base font-normal leading-relaxed mb-6 sm:mb-8 max-w-[440px]">
              Discover handcrafted chandeliers, pendant lights, wall sconces,
              and decorative fixtures designed to transform every room with
              elegance, warmth, and exceptional craftsmanship.
            </p>

            {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5">
                <a
                  href="#collections"
                  className="btn-3d btn-3d-white text-[#2A1810] text-sm font-medium px-6 py-2.5 rounded-full"
                >
                  Explore Collections
                </a>
                <a
                  href="https://wa.me/919990179666?text=Hi%20Nivoseas%2C%20I%20would%20like%20to%20enquire%20about%20your%20lighting%20catalogue."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d btn-3d-glass text-white text-sm font-medium px-5 py-2.5 rounded-full"
                >
                  WhatsApp Enquiry
                </a>
              </div>
            </div>
          </div>
        </section>
        );
}
