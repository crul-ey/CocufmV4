"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sun, Waves, Palmtree } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroSlides = [
  {
    id: 1,
    title: "Zomer Collectie 2025",
    subtitle: "Premium Strandhanddoeken",
    description:
      "Ontdek onze luxe collectie van zachte, absorberende strandhanddoeken. Perfect voor jouw zomervakantie.",
    image:
      "/strandhandoek.png?height=800&width=1200&text=Luxe+Strandhanddoeken",
    cta: "Shop Handdoeken",
    ctaLink: "/shop?category=handdoeken",
    accent: "text-blue-500",
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
    accent: "text-orange-500",
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
    accent: "text-green-500",
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
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-orange-50 to-green-50 dark:from-blue-950/30 dark:via-orange-950/30 dark:to-green-950/30"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image - VEEL BETER ZICHTBAAR IN LIGHT MODE */}
      <div className="absolute inset-0">
        <Image
          src={currentHero.image || "/placeholder.svg"}
          alt={currentHero.title}
          fill
          className="object-cover opacity-60 dark:opacity-30 transition-opacity duration-1000"
          priority
        />
        {/* VEEL LICHTERE OVERLAY VOOR LIGHT MODE */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/20 to-white/40 dark:from-stone-900/70 dark:via-stone-900/50 dark:to-stone-900/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 animate-fade-in-up">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-white/95 dark:bg-stone-800/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-white/30 dark:border-stone-700/30">
            <IconComponent className={`w-10 h-10 ${currentHero.accent}`} />
          </div>
        </div>

        {/* Title - Sterke contrast voor light mode */}
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-stone-900 dark:text-stone-100 mb-4 drop-shadow-lg">
          {currentHero.title}
          <span className="block bg-gradient-to-r from-blue-600 via-orange-500 to-green-600 bg-clip-text text-transparent drop-shadow-lg mt-2">
            {currentHero.subtitle}
          </span>
        </h1>

        {/* Description - Sterke tekst voor light mode */}
        <p className="text-lg md:text-xl text-stone-800 dark:text-stone-200 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md font-semibold">
          {currentHero.description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            asChild
            className="btn-summer group shadow-xl hover:shadow-2xl"
          >
            <Link href={currentHero.ctaLink}>
              {currentHero.cta}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
          <Button
            asChild
            className="bg-white/90 dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 hover:bg-white dark:hover:bg-stone-700 border-2 border-stone-200 dark:border-stone-600 shadow-lg hover:shadow-xl backdrop-blur-sm"
          >
            <Link href="/cadeaus">Cadeau Ideeën</Link>
          </Button>
        </div>

        {/* Slide Indicators - Veel beter zichtbaar */}
        <div className="flex justify-center space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 shadow-lg ${
                index === currentSlide
                  ? "bg-blue-600 dark:bg-blue-400 scale-125 shadow-xl"
                  : "bg-white/90 dark:bg-stone-600/80 hover:bg-blue-500 dark:hover:bg-blue-500 backdrop-blur-sm border-2 border-stone-300/50 dark:border-stone-500/50"
              }`}
              aria-label={`Ga naar slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/80 rounded-full animate-float shadow-lg" />
      <div className="absolute top-40 right-20 w-6 h-6 bg-orange-400/80 rounded-full animate-float-delayed shadow-lg" />
      <div className="absolute bottom-32 left-20 w-5 h-5 bg-green-400/80 rounded-full animate-float shadow-lg" />
    </section>
  );
}
