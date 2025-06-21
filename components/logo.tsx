"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface LogoProps {
  variant?: "full" | "compact" | "icon";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Logo({
  variant = "full",
  className = "",
  size = "md",
}: LogoProps) {
  const [currentVariant, setCurrentVariant] = useState(variant);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const actualTheme = theme === "system" ? systemTheme : theme;

  // Auto-responsive behavior based on screen size
  useEffect(() => {
    if (variant === "full") {
      const handleResize = () => {
        if (window.innerWidth < 640) {
          setCurrentVariant("compact");
        } else if (window.innerWidth < 768) {
          setCurrentVariant("compact");
        } else {
          setCurrentVariant("full");
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    } else {
      setCurrentVariant(variant);
    }
  }, [variant]);

  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
    xl: "h-12",
  };

  // Enhanced colors for optimal contrast in both themes
  const colors = {
    // Light mode colors
    light: {
      bottleBody: "#F7F5F3",
      bottleBodyGradient: "#F0EDE8",
      bottleBodyEnd: "#E8E3DB",
      bottleStroke: "#6B5B47",
      cap: "#6B5B47",
      liquid: "#8B7355",
      liquidGradient: "#D4C4A8",
      spray: "#8B7355",
      text: "#2D2520",
      tagline: "#6B5B47",
      background: "#F7F5F3",
      backgroundGradient: "#F0EDE8",
    },
    // Dark mode colors - enhanced beige and black
    dark: {
      bottleBody: "#2A2520",
      bottleBodyGradient: "#1F1B16",
      bottleBodyEnd: "#141210",
      bottleStroke: "#D4C4A8",
      cap: "#D4C4A8",
      liquid: "#B8956F",
      liquidGradient: "#A68B5B",
      spray: "#B8956F",
      text: "#F0EDE8",
      tagline: "#D4C4A8",
      background: "#000000",
      backgroundGradient: "#1A1A1A",
    },
  };

  if (!mounted) {
    return <div className={`${sizeClasses[size]} ${className}`} />;
  }

  const currentColors =
    colors[actualTheme as keyof typeof colors] || colors.light;

  const LogoFull = () => (
    <div
      className={`flex items-center space-x-3 ${className} logo-dark-mode transition-all duration-300`}
    >
      {/* Perfume Bottle Icon */}
      <div className={`${sizeClasses[size]} aspect-[3/4] relative`}>
        <svg
          viewBox="0 0 24 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Bottle Body */}
          <path
            d="M6 12C6 10.8954 6.89543 10 8 10H16C17.1046 10 18 10.8954 18 12V26C18 28.2091 16.2091 30 14 30H10C7.79086 30 6 28.2091 6 26V12Z"
            fill="url(#bottleGradient)"
            stroke={currentColors.bottleStroke}
            strokeWidth="0.5"
          />

          {/* Bottle Neck */}
          <rect
            x="10"
            y="6"
            width="4"
            height="4"
            fill="url(#neckGradient)"
            stroke={currentColors.bottleStroke}
            strokeWidth="0.5"
          />

          {/* Cap */}
          <rect
            x="9"
            y="4"
            width="6"
            height="3"
            rx="1"
            fill={currentColors.cap}
          />

          {/* Spray Effect */}
          <g opacity="0.7">
            <circle cx="16" cy="6" r="0.5" fill={currentColors.spray} />
            <circle cx="17.5" cy="5" r="0.3" fill={currentColors.spray} />
            <circle cx="18" cy="7" r="0.4" fill={currentColors.spray} />
            <circle cx="19" cy="6" r="0.2" fill={currentColors.spray} />
          </g>

          {/* Liquid */}
          <path
            d="M7 14C7 13.4477 7.44772 13 8 13H16C16.5523 13 17 13.4477 17 14V25C17 26.6569 15.6569 28 14 28H10C8.34315 28 7 26.6569 7 25V14Z"
            fill="url(#liquidGradient)"
          />

          {/* Highlight */}
          <ellipse
            cx="10"
            cy="16"
            rx="1"
            ry="3"
            fill={
              actualTheme === "dark"
                ? "rgba(240, 237, 232, 0.2)"
                : "rgba(255,255,255,0.3)"
            }
          />

          <defs>
            <linearGradient
              id="bottleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={currentColors.bottleBody} />
              <stop offset="50%" stopColor={currentColors.bottleBodyGradient} />
              <stop offset="100%" stopColor={currentColors.bottleBodyEnd} />
            </linearGradient>
            <linearGradient id="neckGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={currentColors.bottleBodyGradient} />
              <stop offset="100%" stopColor={currentColors.bottleBodyEnd} />
            </linearGradient>
            <linearGradient
              id="liquidGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={currentColors.liquidGradient} />
              <stop offset="100%" stopColor={currentColors.liquid} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <span
          className={`font-serif font-bold leading-none transition-all duration-300 ${
            size === "sm"
              ? "text-lg"
              : size === "md"
              ? "text-xl"
              : size === "lg"
              ? "text-2xl"
              : "text-3xl"
          }`}
          style={{ color: currentColors.text }}
        >
          cocúfum
        </span>
        <span
          className={`font-sans uppercase tracking-wider leading-none transition-all duration-300 ${
            size === "sm"
              ? "text-[8px]"
              : size === "md"
              ? "text-[10px]"
              : size === "lg"
              ? "text-xs"
              : "text-sm"
          }`}
          style={{ color: currentColors.tagline }}
        >
          luxury products
        </span>
      </div>
    </div>
  );

  const LogoCompact = () => (
    <div
      className={`flex items-center space-x-2 ${className} logo-dark-mode transition-all duration-300`}
    >
      {/* Simplified Bottle Icon */}
      <div className={`${sizeClasses[size]} aspect-[3/4] relative`}>
        <svg
          viewBox="0 0 20 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Simplified Bottle */}
          <path
            d="M5 10C5 9.44772 5.44772 9 6 9H14C14.5523 9 15 9.44772 15 10V22C15 24.2091 13.2091 26 11 26H9C6.79086 26 5 24.2091 5 22V10Z"
            fill="url(#compactBottleGradient)"
            stroke={currentColors.bottleStroke}
            strokeWidth="0.5"
          />

          {/* Cap */}
          <rect
            x="7"
            y="6"
            width="6"
            height="3"
            rx="1"
            fill={currentColors.cap}
          />

          {/* Liquid */}
          <path
            d="M6 12H14V21C14 22.6569 12.6569 24 11 24H9C7.34315 24 6 22.6569 6 21V12Z"
            fill={currentColors.liquid}
          />

          <defs>
            <linearGradient
              id="compactBottleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={currentColors.bottleBody} />
              <stop offset="100%" stopColor={currentColors.bottleBodyEnd} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Compact Text */}
      <span
        className={`font-serif font-bold transition-all duration-300 ${
          size === "sm"
            ? "text-base"
            : size === "md"
            ? "text-lg"
            : size === "lg"
            ? "text-xl"
            : "text-2xl"
        }`}
        style={{ color: currentColors.text }}
      >
        cocúfum
      </span>
    </div>
  );

  const LogoIcon = () => (
    <div
      className={`${sizeClasses[size]} aspect-square relative ${className} logo-dark-mode transition-all duration-300`}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Icon Background Circle */}
        <circle
          cx="16"
          cy="16"
          r="15"
          fill="url(#iconBackground)"
          stroke={currentColors.bottleStroke}
          strokeWidth="1"
        />

        {/* Centered Bottle */}
        <path
          d="M10 14C10 13.4477 10.4477 13 11 13H21C21.5523 13 22 13.4477 22 14V24C22 25.6569 20.6569 27 19 27H13C11.3431 27 10 25.6569 10 24V14Z"
          fill="url(#iconBottleGradient)"
          stroke={currentColors.bottleStroke}
          strokeWidth="0.5"
        />

        {/* Cap */}
        <rect
          x="13"
          y="10"
          width="6"
          height="3"
          rx="1"
          fill={currentColors.cap}
        />

        {/* Liquid */}
        <path
          d="M11 16H21V23C21 24.1046 20.1046 25 19 25H13C11.8954 25 11 24.1046 11 23V16Z"
          fill={currentColors.liquid}
        />

        {/* Highlight */}
        <ellipse
          cx="13"
          cy="18"
          rx="0.5"
          ry="2"
          fill={
            actualTheme === "dark"
              ? "rgba(240, 237, 232, 0.3)"
              : "rgba(255,255,255,0.4)"
          }
        />

        <defs>
          <radialGradient id="iconBackground" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor={currentColors.background} />
            <stop offset="100%" stopColor={currentColors.backgroundGradient} />
          </radialGradient>
          <linearGradient
            id="iconBottleGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={currentColors.bottleBody} />
            <stop offset="100%" stopColor={currentColors.bottleBodyEnd} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  if (currentVariant === "compact") return <LogoCompact />;
  if (currentVariant === "icon") return <LogoIcon />;
  return <LogoFull />;
}
