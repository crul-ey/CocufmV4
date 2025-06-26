import type { Metadata } from "next";
import EnhancedHeader from "@/components/header";
import HeroSection from "@/components/hero-section";
import EnhancedCartDrawer from "@/components/cart-drawer";
import EnhancedProductCard from "@/components/product-card";
import Logo from "@/components/logo";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Truck,
  Shield,
  Leaf,
  Waves,
  Umbrella,
  Gift,
  Users,
  Globe,
  Award,
  Heart,
  Sparkles,
  CheckCircle,
  Zap,
  Crown,
  Gem,
  Code,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/lib/shopify";

// SEO-optimized metadata
export const metadata: Metadata = {
  title:
    "Cocúfum - Premium Strandhanddoeken & Luxe Zomerproducten | #1 in Nederland",
  description:
    "✨ Ontdek Nederland's #1 collectie premium strandhanddoeken, luxe beach lifestyle producten en exclusieve zomer essentials. Gratis verzending vanaf €75 | 14 dagen retourrecht | 5⭐ klantenservice",
  keywords: [
    "premium strandhanddoeken",
    "luxe beach towels Nederland",
    "beste strandhanddoeken kopen",
    "zomerproducten online shop",
    "beach lifestyle accessoires",
    "strand essentials premium kwaliteit",
    "cocufum strandhanddoeken",
    "luxe badhanddoeken strand",
    "zomer collectie 2025",
    "beach towel premium brands",
  ],
  openGraph: {
    title: "Cocúfum - Premium Strandhanddoeken & Luxe Zomerproducten",
    description:
      "Nederland's #1 voor premium strandhanddoeken en luxe zomerproducten. Gratis verzending | 5⭐ service | 14 dagen retourrecht",
  },
};

export default async function HomePage() {
  const featuredProducts = await getProducts(8);

  return (
    <>
      <EnhancedHeader />
      <EnhancedCartDrawer />

      <main className="overflow-hidden">
        {/* Hero Section - Originele component behouden! */}
        <HeroSection />

        {/* Enhanced USPs Section */}
        <section className="section-padding bg-white dark:bg-stone-900 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          <div className="container relative z-10">
            {/* Section Header */}
            <div className="text-center mb-20 animate-fade-in-up">
              <Badge
                variant="outline"
                className="mb-4 text-sm font-semibold border-2 border-amber-200 text-amber-800 bg-amber-50 dark:border-amber-800 dark:text-amber-200 dark:bg-amber-900/20"
              >
                <Award className="w-4 h-4 mr-2" />
                Waarom Klanten Voor Ons Kiezen
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-6">
                De{" "}
                <span className="text-gradient bg-gradient-to-r from-stone-800 via-amber-700 to-stone-900 bg-clip-text text-transparent">
                  Cocúfum
                </span>{" "}
                Belofte
              </h2>
              <p className="text-xl text-stone-600 dark:text-stone-400 max-w-3xl mx-auto leading-relaxed">
                Jouw perfecte zomer begint met de juiste keuze. Ontdek waarom
                wij Nederland's meest vertrouwde
                <strong> premium beach lifestyle brand</strong> zijn.
              </p>
            </div>

            {/* Enhanced USP Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  icon: Truck,
                  title: "Gratis Verzending & Snelle Levering",
                  description:
                    "Gratis verzending binnen Nederland vanaf €75. Express levering binnen 24-48 uur beschikbaar. Tracking inbegrepen.",
                  color: "text-stone-700 dark:text-stone-300",
                  bgColor:
                    "from-stone-100 to-stone-50 dark:from-stone-800/40 dark:to-stone-700/20",
                  highlight: "Vanaf €75",
                },
                {
                  icon: Shield,
                  title: "100% Tevredenheidsgarantie",
                  description:
                    "14 dagen retourrecht zonder vragen. Niet 100% tevreden? Volledige terugbetaling gegarandeerd. Geen gedoe, gewoon service.",
                  color: "text-amber-700 dark:text-amber-300",
                  bgColor:
                    "from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/20",
                  highlight: "14 dagen retour",
                },
                {
                  icon: Leaf,
                  title: "Duurzaam & Milieuvriendelijk",
                  description:
                    "100% duurzame materialen, OEKO-TEX gecertificeerd. Plasticvrije verpakking. Goed voor jou én onze planeet.",
                  color: "text-stone-600 dark:text-stone-400",
                  bgColor:
                    "from-stone-200 to-stone-100 dark:from-stone-700/40 dark:to-stone-600/20",
                  highlight: "OEKO-TEX",
                },
                {
                  icon: Crown,
                  title: "Premium Kwaliteit Gegarandeerd",
                  description:
                    "Handgeselecteerde materialen van topkwaliteit. Elke handdoek getest op duurzaamheid, zachtheid en kleurvastheid.",
                  color: "text-amber-800 dark:text-amber-200",
                  bgColor:
                    "from-amber-50 to-stone-50 dark:from-amber-900/30 dark:to-stone-800/20",
                  highlight: "Premium",
                },
                {
                  icon: Users,
                  title: "5⭐ Klantenservice",
                  description:
                    "Persoonlijk advies van onze beach lifestyle experts. WhatsApp support, live chat en telefonische hulp beschikbaar.",
                  color: "text-stone-700 dark:text-stone-300",
                  bgColor:
                    "from-stone-100 to-amber-50 dark:from-stone-800/40 dark:to-amber-900/20",
                  highlight: "5⭐ Service",
                },
                {
                  icon: Globe,
                  title: "Exclusieve Wereldwijde Collecties",
                  description:
                    "Unieke designs van internationale topmerken. Limited editions en exclusieve Cocúfum collecties die je nergens anders vindt.",
                  color: "text-stone-800 dark:text-stone-200",
                  bgColor:
                    "from-stone-50 to-stone-100 dark:from-stone-900/40 dark:to-stone-800/20",
                  highlight: "Exclusief",
                },
              ].map((usp, index) => (
                <div
                  key={index}
                  className="group relative animate-fade-in-up hover:scale-105 transition-all duration-500"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card */}
                  <div
                    className={`relative p-8 rounded-3xl bg-gradient-to-br ${usp.bgColor} border border-stone-200/50 dark:border-stone-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 h-full`}
                  >
                    {/* Highlight Badge */}
                    <div className="absolute -top-3 -right-3">
                      <Badge
                        className={`bg-gradient-to-r from-amber-100 to-stone-100 dark:from-amber-900/50 dark:to-stone-800/50 ${usp.color} border-2 border-amber-200 dark:border-amber-700 font-bold text-xs px-3 py-1`}
                      >
                        {usp.highlight}
                      </Badge>
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-16 h-16 bg-gradient-to-br from-white to-stone-50 dark:from-stone-800 dark:to-stone-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}
                    >
                      <usp.icon className={`w-8 h-8 ${usp.color}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-4 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors">
                      {usp.title}
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      {usp.description}
                    </p>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent to-amber-50/20 dark:to-amber-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="mt-20 text-center animate-fade-in-up">
              <div className="flex flex-wrap justify-center items-center gap-8 text-stone-500 dark:text-stone-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="font-semibold">SSL Beveiligd</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                  <span className="font-semibold">Veilig Betalen</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                  <span className="font-semibold">Keurmerk Gecertificeerd</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Featured Products */}
        <section
          id="featured-products"
          className="section-padding bg-gradient-to-br from-stone-100 via-amber-50 to-stone-50 dark:from-stone-900/20 dark:via-amber-950/20 dark:to-stone-800/20 relative overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-stone-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-amber-400/5 rounded-full blur-3xl"></div>

          <div className="container relative z-10">
            {/* Section Header */}
            <div className="text-center mb-20 animate-fade-in-up">
              <Badge
                variant="outline"
                className="mb-4 text-sm font-semibold border-2 border-stone-300 text-stone-700 bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:bg-stone-800/50"
              >
                <Gem className="w-4 h-4 mr-2" />
                Bestsellers & Trending Nu
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-6">
                Premium{" "}
                <span className="text-gradient bg-gradient-to-r from-stone-800 via-amber-700 to-stone-900 bg-clip-text text-transparent">
                  Zomer Collectie
                </span>{" "}
                2025
              </h2>
              <p className="text-xl text-stone-600 dark:text-stone-400 max-w-3xl mx-auto leading-relaxed">
                Ontdek onze meest populaire{" "}
                <strong>premium strandhanddoeken</strong> en
                <strong> luxe beach lifestyle producten</strong>.
                Handgeselecteerd voor kwaliteit, stijl en comfort - perfect voor
                strand, zwembad en vakantie.
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up hover:scale-105 transition-all duration-500"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    {/* Trending Badge */}
                    {index < 2 && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <Badge className="bg-gradient-to-r from-amber-600 to-stone-700 text-white border-0 font-bold text-xs px-3 py-1 shadow-lg">
                          <Zap className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      </div>
                    )}
                    <EnhancedProductCard
                      product={product}
                      priority={index < 2}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center animate-fade-in-up">
              <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm rounded-3xl p-8 border border-stone-200/50 dark:border-stone-700/50 shadow-xl max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                  Ontdek Onze Volledige Premium Collectie
                </h3>
                <p className="text-stone-600 dark:text-stone-400 mb-6">
                  Meer dan 200+ premium producten wachten op je. Van exclusieve
                  strandhanddoeken tot luxe beach accessoires - vind jouw
                  perfecte zomer essentials.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-stone-800 to-amber-700 hover:from-stone-900 hover:to-amber-800 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="/shop">
                    <Crown className="mr-2 w-5 h-5" />
                    Shop Alle Premium Producten
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Categories Section */}
        <section className="section-padding bg-white dark:bg-stone-900 relative overflow-hidden">
          <div className="container relative z-10">
            {/* Section Header */}
            <div className="text-center mb-20 animate-fade-in-up">
              <Badge
                variant="outline"
                className="mb-4 text-sm font-semibold border-2 border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-800 dark:text-amber-200 dark:bg-amber-900/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Shop per Categorie
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-6">
                Vind Jouw Perfecte{" "}
                <span className="text-gradient bg-gradient-to-r from-stone-800 via-amber-700 to-stone-900 bg-clip-text text-transparent">
                  Beach Lifestyle
                </span>
              </h2>
              <p className="text-xl text-stone-600 dark:text-stone-400 max-w-3xl mx-auto leading-relaxed">
                Van premium strandhanddoeken tot exclusieve beach accessoires -
                ontdek onze zorgvuldig samengestelde categorieën voor jouw
                perfecte zomer.
              </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Waves,
                  title: "Premium Strandhanddoeken",
                  description:
                    "Luxe, ultra-zachte handdoeken van topkwaliteit. OEKO-TEX gecertificeerd, sneldrogend en kleurbestendig.",
                  image: "/strandspul.png?height=300&width=400",
                  link: "/shop?category=strandhanddoeken",
                  color: "from-stone-600 to-stone-800",
                  badge: "Bestseller",
                  features: ["Ultra-zacht", "Sneldrogend", "OEKO-TEX"],
                },
                {
                  icon: Umbrella,
                  title: "Beach Lifestyle Accessoires",
                  description:
                    "Alles voor de perfecte stranddag. Van stijlvolle tassen tot praktische accessoires - compleet je beach look.",
                  image: "/strandhandoek.png?height=300&width=400",
                  link: "/shop?category=strand-accessoires",
                  color: "from-amber-600 to-amber-800",
                  badge: "Trending",
                  features: ["Waterbestendig", "Stijlvol", "Praktisch"],
                },
                {
                  icon: Gift,
                  title: "Exclusieve Cadeaus & Lifestyle",
                  description:
                    "Unieke lifestyle producten en perfecte cadeaus. Limited editions en exclusieve items voor de echte beach lover.",
                  image: "/hangmat.png?height=300&width=400",
                  link: "/cadeaus",
                  color: "from-stone-700 to-amber-700",
                  badge: "Exclusief",
                  features: ["Limited Edition", "Uniek", "Premium"],
                },
              ].map((category, index) => (
                <Link
                  key={index}
                  href={category.link}
                  className="group block animate-fade-in-up hover:scale-105 transition-all duration-500"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-stone-800 shadow-lg hover:shadow-2xl transition-all duration-500 border border-stone-200/50 dark:border-stone-700/50">
                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <Badge
                        className={`bg-gradient-to-r ${category.color} text-white border-0 font-bold text-xs px-3 py-1 shadow-lg`}
                      >
                        {category.badge}
                      </Badge>
                    </div>

                    {/* Image */}
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={`${category.title} - Premium beach lifestyle producten`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
                      />

                      {/* Overlay Content */}
                      <div className="absolute inset-0 flex items-end p-6">
                        <div className="text-white">
                          <category.icon className="w-8 h-8 mb-2 drop-shadow-lg" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-3 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
                        {category.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {category.features.map((feature, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs font-medium"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors font-semibold">
                        <span>Ontdek Collectie</span>
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Clean Brand Story Section */}
        <section className="section-padding bg-stone-50 dark:bg-stone-800/50 relative overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16 animate-fade-in-up">
                <Badge
                  variant="outline"
                  className="mb-4 text-sm font-semibold border-2 border-stone-300 text-stone-700 bg-white dark:border-stone-600 dark:text-stone-300 dark:bg-stone-800"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Ons Verhaal
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-6 leading-tight">
                  Van{" "}
                  <span className="text-amber-600 dark:text-amber-400">
                    Developer
                  </span>{" "}
                  Tot Eerlijkste Webshop
                </h2>
              </div>

              {/* Story Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Text Content */}
                <div className="space-y-6 text-lg text-stone-700 dark:text-stone-300 leading-relaxed animate-fade-in-up">
                  <p>
                    Hoi! Ik ben van origine een{" "}
                    <strong className="text-stone-900 dark:text-stone-100">
                      developer die websites maakt
                    </strong>
                    . Cocúfum begon eigenlijk als een uitdaging voor mezelf -
                    kon ik een dropship website bouwen die anders was dan de
                    rest?
                  </p>

                  <p>
                    Wat als een experiment begon, is uitgegroeid tot een{" "}
                    <strong className="text-stone-900 dark:text-stone-100">
                      serieus project
                    </strong>
                    . Het verschil? Ik heb de marges zo klein mogelijk gehouden
                    om jullie de{" "}
                    <strong className="text-amber-600 dark:text-amber-400">
                      eerlijkste prijzen
                    </strong>{" "}
                    te geven, niet de goedkoopste, maar wel de eerlijkste.
                  </p>

                  <p>
                    Omdat ik zelf de website maak en onderhoud, heb ik lage
                    kosten. Die besparing geef ik door aan jullie. Zie je een
                    product ergens goedkoper?{" "}
                    <strong className="text-stone-900 dark:text-stone-100">
                      Laat het me weten!
                    </strong>{" "}
                    Dan ga ik ervoor zorgen dat wij het anders gaan doen.
                  </p>

                  <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-500 p-6 rounded-r-lg">
                    <p className="text-amber-800 dark:text-amber-200 font-medium">
                      🌟 <strong>Let op:</strong> De website verandert per
                      seizoen - van zomer naar winter, cyber, lente en herfst.
                      Hou deze website in de gaten, anders mis je het! Producten
                      die succesvol zijn blijven zolang de voorraad dat toelaat.
                    </p>
                  </div>
                </div>

                {/* Values & CTA */}
                <div className="animate-fade-in-up lg:animate-fade-in-left">
                  {/* Values Grid */}
                  <div className="grid grid-cols-1 gap-6 mb-8">
                    {[
                      {
                        icon: Code,
                        title: "Eerlijke Prijzen",
                        description: "Geen opgeblazen marges, gewoon eerlijk",
                        color: "text-amber-600 dark:text-amber-400",
                      },
                      {
                        icon: Calendar,
                        title: "Seizoens Collecties",
                        description: "Altijd nieuwe producten per seizoen",
                        color: "text-stone-600 dark:text-stone-400",
                      },
                      {
                        icon: MessageCircle,
                        title: "Direct Contact",
                        description: "Rechtstreeks met de maker van de site",
                        color: "text-stone-700 dark:text-stone-300",
                      },
                    ].map((value, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm"
                      >
                        <div className="w-12 h-12 bg-stone-100 dark:bg-stone-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <value.icon className={`w-6 h-6 ${value.color}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-1">
                            {value.title}
                          </h3>
                          <p className="text-sm text-stone-600 dark:text-stone-400">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Match Guarantee */}
                  <div className="bg-gradient-to-r from-amber-100 to-stone-100 dark:from-amber-900/30 dark:to-stone-800/30 p-6 rounded-2xl border border-amber-200 dark:border-amber-800/50 mb-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                        💡 Goedkoper gezien?
                      </div>
                      <div className="text-stone-700 dark:text-stone-300 mb-4">
                        Laat het me weten en ik pas de prijs aan!
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        className="border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                      >
                        <Link href="/contact">
                          <MessageCircle className="mr-2 w-4 h-4" />
                          Meld Lagere Prijs
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      asChild
                      size="lg"
                      className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                      <Link href="/shop">
                        <Sparkles className="mr-2 w-5 h-5" />
                        Ontdek Onze Collectie
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>

                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 px-6 py-3 rounded-xl font-semibold"
                    >
                      <Link href="/contact">
                        <Users className="mr-2 w-5 h-5" />
                        Direct Contact
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-stone-950 text-white section-padding relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Logo variant="full" size="lg" />
              </div>
              <p className="text-stone-300 mb-6 max-w-md leading-relaxed text-lg">
                <strong>Cocúfum</strong> is Nederland's premium beach lifestyle
                brand. Van luxe strandhanddoeken tot exclusieve accessoires -
                wij maken jouw zomer perfect met eerlijke prijzen en kwaliteit.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 mb-6">
                <Badge className="bg-amber-900/50 text-amber-200 border-amber-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  SSL Beveiligd
                </Badge>
                <Badge className="bg-stone-800/50 text-stone-200 border-stone-700">
                  <Shield className="w-3 h-3 mr-1" />
                  Veilig Betalen
                </Badge>
                <Badge className="bg-amber-800/50 text-amber-200 border-amber-700">
                  <Award className="w-3 h-3 mr-1" />
                  Keurmerk
                </Badge>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-stone-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  Instagram
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-stone-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  Facebook
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-stone-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  TikTok
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="font-bold mb-6 text-lg text-white">Shop</h3>
              <ul className="space-y-3 text-stone-300">
                {[
                  {
                    name: "Premium Strandhanddoeken",
                    href: "/shop?category=strandhanddoeken",
                  },
                  {
                    name: "Beach Lifestyle",
                    href: "/shop?category=beach-lifestyle",
                  },
                  { name: "Exclusieve Cadeaus", href: "/cadeaus" },
                  { name: "Alle Producten", href: "/shop" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors duration-200 hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service & Legal */}
            <div>
              <h3 className="font-bold mb-6 text-lg text-white">
                Service & Info
              </h3>
              <ul className="space-y-3 text-stone-300">
                {[
                  { name: "Contact & Support", href: "/contact" },
                  { name: "Veelgestelde Vragen", href: "/faq" },
                  { name: "Privacy Policy", href: "/privacy-policy" },
                  {
                    name: "Algemene Voorwaarden",
                    href: "/algemene-voorwaarden",
                  },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors duration-200 hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-stone-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-stone-400 text-sm">
                &copy; 2025 <strong>Cocúfum</strong>. Alle rechten voorbehouden.
                Nederland's Premium Beach Lifestyle Brand.
              </p>
              <div className="flex items-center space-x-6 text-sm text-stone-400">
                <span>📧 info@cocufum.com</span>
                <span>🇳🇱 Made in Netherlands</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
