"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sun, Waves, Palmtree } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroSlides = [
  {
    id: 1,
    title: "Zomer Collectie 2025", // Updated year
    subtitle: "Premium Strandhanddoeken",
    description:
      "Ontdek onze luxe collectie van zachte, absorberende strandhanddoeken. Perfect voor jouw zomervakantie.",
    image:
      "/strandhandoek.png?height=800&width=1200&text=Luxe+Strandhanddoeken",
    cta: "Shop Handdoeken",
    ctaLink: "/shop?category=handdoeken",
    accent: "text-blue-500", // Kept for icon, can be changed
    icon: Waves,
  },
  {
    id: 2,
    title: "Strand Essentials",
    subtitle: "Alles Voor De Perfecte Stranddag",
    description:
      "Van strandtassen tot parasols - wij hebben alles wat je nodig hebt voor een onvergetelijke dag aan het strand.",
    image: "/strandspul.png?height=800&width=1200&text=Strand+Accessoires",
    cta: "Ontdek Accessoires",
    ctaLink: "/shop?category=strand",
    accent: "text-orange-500", // Kept for icon, can be changed
    icon: Sun,
  },
  {
    id: 3,
    title: "Tropische Vibes",
    subtitle: "Lifestyle Producten",
    description:
      "Breng de vakantiesfeer naar huis met onze tropische lifestyle collectie. Kwaliteit en stijl in één.",
    image: "/hangmat.png?height=800&width=1200&text=Tropische+Lifestyle",
    cta: "Lifestyle Shop",
    ctaLink: "/shop?category=lifestyle",
    accent: "text-green-500", // Kept for icon, can be changed
    icon: Palmtree,
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentHero = heroSlides[currentSlide];
  const IconComponent = currentHero.icon;

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-stone-50 via-neutral-50 to-slate-50 dark:from-stone-900/50 dark:via-neutral-900/50 dark:to-slate-900/50" // More muted background gradient
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="absolute inset-0">
        <Image
          src={currentHero.image || "/placeholder.svg"}
          alt={currentHero.title}
          fill
          className="object-cover opacity-50 dark:opacity-25 transition-opacity duration-1000" // Slightly adjusted opacity
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-white/30 to-white/50 dark:from-stone-900/75 dark:via-stone-900/60 dark:to-stone-900/75" />{" "}
        {/* Darker overlay for better text contrast */}
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 animate-fade-in-up">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-white/90 dark:bg-stone-800/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-white/30 dark:border-stone-700/30">
            {/* Icon color is still based on slide's accent. Can be changed to a consistent luxury color e.g., text-stone-600 dark:text-stone-400 */}
            <IconComponent className={`w-10 h-10 ${currentHero.accent}`} />
          </div>
        </div>

        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-stone-900 dark:text-stone-100 mb-4 drop-shadow-lg">
          {currentHero.title}
          {/* Subtitle with luxurious dark gray color */}
          <span className="block text-stone-700 dark:text-stone-300 drop-shadow-md mt-3 text-2xl md:text-4xl lg:text-5xl font-normal">
            {currentHero.subtitle}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-stone-700 dark:text-stone-300 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-sm font-medium">
          {currentHero.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {/* Primary CTA button with luxurious dark gray style */}
          <Button
            asChild
            className="bg-stone-800 hover:bg-stone-700 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-stone-300 text-white group shadow-xl hover:shadow-2xl px-8 py-3 text-lg"
          >
            <Link href={currentHero.ctaLink}>
              {currentHero.cta}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
          {/* Secondary CTA button - kept its style, can be adjusted */}
          <Button
            asChild
            className="bg-white/80 dark:bg-stone-700/80 text-stone-800 dark:text-stone-100 hover:bg-white dark:hover:bg-stone-700 border-2 border-stone-300 dark:border-stone-600 shadow-lg hover:shadow-xl backdrop-blur-sm px-8 py-3 text-lg"
          >
            <Link href="/cadeaus">Cadeau Ideeën</Link>
          </Button>
        </div>

        <div className="flex justify-center space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 shadow-md ${
                // Slightly smaller indicators
                index === currentSlide
                  ? "bg-stone-700 dark:bg-stone-400 scale-125 shadow-lg" // Active indicator with luxury color
                  : "bg-stone-300/70 dark:bg-stone-600/70 hover:bg-stone-500 dark:hover:bg-stone-500 backdrop-blur-sm border border-stone-400/50 dark:border-stone-500/50" // Inactive indicator
              }`}
              aria-label={`Ga naar slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Floating Elements - still use original accent colors. Can be changed to shades of gray or a single luxury accent. */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/50 rounded-full animate-float shadow-lg" />
      <div className="absolute top-40 right-20 w-6 h-6 bg-orange-400/50 rounded-full animate-float-delayed shadow-lg" />
      <div className="absolute bottom-32 left-20 w-5 h-5 bg-green-400/50 rounded-full animate-float shadow-lg" />
    </section>
  );
}
