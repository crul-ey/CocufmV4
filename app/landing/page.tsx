import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingBag,
  Star,
  Truck,
  Shield,
  Users,
  ArrowRight,
  Sparkles,
  Sun,
  Waves,
  Crown,
  Gift,
  CheckCircle,
  Award,
  Palmtree,
  Umbrella,
  MapPin,
  Clock,
  Phone,
  Mail,
} from "lucide-react";
import { getAllProducts } from "@/lib/shopify";
import { BeachScene } from "@/components/beach-scene";

export const metadata: Metadata = {
  title:
    "Cocúfum - Jouw Perfecte Stranddag Begint Hier ✨ Premium Beach Lifestyle",
  description:
    "🏖️ Ontdek Nederland's mooiste strandcollectie! Premium hangmatten, luxe handdoeken & complete beach sets. Gratis verzending, 5⭐ service. Shop nu!",
  keywords:
    "premium strand, hangmat, strandhanddoek, beach lifestyle, zomer, vakantie, cocufum, luxe strand accessoires",
};

// 💰 EXACTE PRIJSFORMATTERING - GEEN AFRONDING
const formatPrice = (amount: string, currencyCode: string) => {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2, // Altijd 2 decimalen tonen
    maximumFractionDigits: 2, // Maximaal 2 decimalen
  }).format(Number.parseFloat(amount));
};

export default async function LandingPage() {
  // Fetch products with 'landing-page' tag from Shopify
  const allProducts = await getAllProducts();
  const landingPageProducts = allProducts
    .filter((product) => product.tags.includes("landing-page"))
    .slice(0, 3); // Show max 3 products

  // Fallback products if no tagged products found
  const featuredProducts =
    landingPageProducts.length > 0
      ? landingPageProducts
      : allProducts.slice(0, 3);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50 to-orange-50 animate-gradient-x"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-4 w-72 h-72 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg shadow-blue-500/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src="/logo-main.png"
                  alt="Cocúfum Logo"
                  width={140}
                  height={45}
                  className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-orange-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Badge className="hidden sm:flex bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1 animate-pulse">
                <CheckCircle className="w-3 h-3 mr-1" />
                Gratis verzending
              </Badge>

              <Link href="/shop">
                <Button className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-2.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <ShoppingBag className="w-4 h-4 mr-2 relative z-10" />
                  <span className="relative z-10 font-semibold">Shop Nu</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/50 to-purple-400/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Beach Animation */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Beach Scene Background */}
        <div className="absolute inset-0 pointer-events-none">
          <BeachScene />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-float">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full backdrop-blur-sm"></div>
          </div>
          <div className="absolute top-40 right-20 animate-float-delayed">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400/30 to-pink-400/30 rounded-full backdrop-blur-sm"></div>
          </div>
          <div className="absolute bottom-32 left-1/4 animate-float">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full backdrop-blur-sm"></div>
          </div>
          <div className="absolute top-1/3 right-1/4 animate-bounce-slow">
            <Palmtree className="w-8 h-8 text-green-400/40" />
          </div>
          <div className="absolute bottom-1/4 right-10 animate-pulse">
            <Umbrella className="w-6 h-6 text-blue-400/40" />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-6xl mx-auto">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 backdrop-blur-sm text-amber-800 px-6 py-3 rounded-full text-sm font-bold mb-8 border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-default">
              <Crown className="w-5 h-5 text-amber-600 group-hover:rotate-12 transition-transform duration-300" />
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Nederland's #1 Premium Beach Brand
              </span>
              <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            </div>

            {/* Main Headline - Ultra Dramatic */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="block text-slate-900 mb-2 animate-fade-in-up">
                Jouw Perfecte
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent animate-fade-in-up animation-delay-200 relative">
                Stranddag
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-orange-500/20 blur-2xl opacity-50 animate-pulse"></div>
              </span>
              <span className="block text-slate-900 animate-fade-in-up animation-delay-400">
                Begint Hier
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-3xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed font-medium animate-fade-in-up animation-delay-600">
              Ontdek onze{" "}
              <strong className="text-blue-600">premium collectie</strong>{" "}
              strandaccessoires. Van{" "}
              <strong className="text-orange-500">luxe hangmatten</strong> tot
              <strong className="text-purple-600">
                {" "}
                stijlvolle handdoeken
              </strong>{" "}
              - alles voor de perfecte zomerervaring.
            </p>

            {/* Trust Stats - Animated */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12 animate-fade-in-up animation-delay-800">
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform duration-300"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-slate-900">5000+</div>
                  <div className="text-sm text-slate-600">Tevreden klanten</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform duration-300"
                      style={{ animationDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-slate-900">4.9/5</div>
                  <div className="text-sm text-slate-600">
                    Gemiddelde review
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                <Truck className="w-8 h-8 text-green-500 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-slate-900">
                    Gratis
                  </div>
                  <div className="text-sm text-slate-600">Verzending €50+</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons - Ultra Premium */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up animation-delay-1000">
              <Link href="/shop">
                <Button
                  size="lg"
                  className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 group min-w-[280px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/50 to-purple-400/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  <Sparkles className="w-6 h-6 mr-3 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="relative z-10">
                    Ontdek Premium Collectie
                  </span>
                  <ArrowRight className="w-6 h-6 ml-3 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>

              <Link href="/shop?category=bestsellers">
                <Button
                  variant="outline"
                  size="lg"
                  className="relative overflow-hidden border-2 border-slate-300 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:border-blue-400 hover:text-blue-600 px-10 py-5 rounded-2xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group min-w-[280px]"
                >
                  <Award className="w-6 h-6 mr-3 group-hover:text-yellow-500 transition-colors duration-300" />
                  <span>Bekijk Bestsellers</span>
                </Button>
              </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="animate-bounce mt-8">
              <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase - Real Shopify Products */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white"></div>

        <div className="container mx-auto px-4 relative">
          {/* Section Header */}
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200/50 px-6 py-2 text-base font-bold shadow-lg">
              <Gift className="w-5 h-5 mr-2" />
              Handgeselecteerde Bestsellers
            </Badge>

            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
              Onze Meest
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Geliefde Producten
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Elk product is zorgvuldig geselecteerd voor{" "}
              <strong>premium kwaliteit</strong>,
              <strong> ongeëvenaarde comfort</strong> en{" "}
              <strong>tijdloze stijl</strong>
            </p>

            {/* 💰 TRANSPARANTE PRIJZEN BANNER */}
            <div className="max-w-4xl mx-auto mb-12 p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-2 border-green-200/50 rounded-2xl shadow-lg">
              <div className="flex items-center justify-center space-x-3 text-green-800 mb-2">
                <Shield className="w-6 h-6" />
                <span className="font-bold text-lg">
                  100% Transparante Prijzen
                </span>
                <CheckCircle className="w-6 h-6" />
              </div>
              <p className="text-center text-green-700 font-medium">
                <strong>Exacte bedragen, geen afrondingen</strong> • Wat je ziet
                is wat je betaalt • Inclusief BTW
              </p>
            </div>
          </div>

          {/* Dynamic Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {featuredProducts.map((product, index) => {
              const firstImage = product.images.edges[0]?.node;
              const firstVariant = product.variants.edges[0]?.node;
              const price = firstVariant?.price;
              const compareAtPrice = firstVariant?.compareAtPrice;

              const gradients = [
                "from-blue-600/5 via-transparent to-purple-600/5",
                "from-orange-600/5 via-transparent to-pink-600/5",
                "from-purple-600/5 via-transparent to-blue-600/5",
              ];

              const hoverColors = [
                "group-hover:text-blue-600",
                "group-hover:text-orange-600",
                "group-hover:text-purple-600",
              ];

              return (
                <Card
                  key={product.id}
                  className={`group relative overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-white border-0 shadow-xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-4 ${
                    index % 2 === 0 ? "hover:rotate-1" : "hover:-rotate-1"
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  ></div>

                  <div className="relative overflow-hidden rounded-t-3xl">
                    {firstImage && (
                      <Image
                        src={firstImage.url || "/placeholder.svg"}
                        alt={firstImage.altText || product.title}
                        width={500}
                        height={400}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    )}

                    {/* Dynamic Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.tags.includes("bestseller") && (
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 font-bold shadow-lg animate-pulse">
                          <Crown className="w-3 h-3 mr-1" />
                          Bestseller
                        </Badge>
                      )}
                      {product.tags.includes("new") && (
                        <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 font-bold shadow-lg animate-pulse">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Nieuw
                        </Badge>
                      )}
                      {product.tags.includes("premium") && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 font-bold shadow-lg">
                          <Award className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                      <Link href={`/product/${product.handle}`}>
                        <Button className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-2 rounded-full font-semibold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Bekijk Product
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className={`text-2xl font-bold text-slate-900 ${hoverColors[index]} transition-colors duration-300`}
                      >
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-slate-600 mb-6 leading-relaxed line-clamp-3">
                      {product.description}
                    </p>

                    {/* Product Features */}
                    <div className="space-y-2 mb-6">
                      {product.tags
                        .filter(
                          (tag) =>
                            ![
                              "landing-page",
                              "bestseller",
                              "new",
                              "premium",
                            ].includes(tag)
                        )
                        .slice(0, 3)
                        .map((tag, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm text-slate-600"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="capitalize">
                              {tag.replace("-", " ")}
                            </span>
                          </div>
                        ))}
                    </div>

                    {/* 💰 EXACTE PRIJSWEERGAVE - GEEN AFRONDING */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {price && (
                          <>
                            <span className="text-3xl font-black text-slate-900">
                              {formatPrice(price.amount, price.currencyCode)}
                            </span>
                            {compareAtPrice &&
                              Number.parseFloat(compareAtPrice.amount) >
                                Number.parseFloat(price.amount) && (
                                <>
                                  <span className="text-lg text-slate-500 line-through">
                                    {formatPrice(
                                      compareAtPrice.amount,
                                      compareAtPrice.currencyCode
                                    )}
                                  </span>
                                  <Badge className="bg-red-100 text-red-700 text-xs font-bold">
                                    -
                                    {Math.round(
                                      ((Number.parseFloat(
                                        compareAtPrice.amount
                                      ) -
                                        Number.parseFloat(price.amount)) /
                                        Number.parseFloat(
                                          compareAtPrice.amount
                                        )) *
                                        100
                                    )}
                                    %
                                  </Badge>
                                </>
                              )}
                          </>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-green-600 font-semibold">
                          {product.availableForSale
                            ? "✓ Op voorraad"
                            : "✗ Uitverkocht"}
                        </div>
                        <div className="text-slate-500">{product.vendor}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* View All CTA */}
          <div className="text-center">
            <Link href="/shop">
              <Button
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 hover:from-slate-800 hover:via-blue-800 hover:to-purple-800 text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 group min-w-[300px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Crown className="w-6 h-6 mr-3 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">
                  Bekijk Alle Premium Producten
                </span>
                <ArrowRight className="w-6 h-6 ml-3 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.05%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-white/10 backdrop-blur-sm text-white border-white/20 px-6 py-2 text-base font-bold">
              <Star className="w-5 h-5 mr-2" />
              Wat Onze Klanten Zeggen
            </Badge>

            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Echte Verhalen Van
              <span className="block text-yellow-400">Tevreden Klanten</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah M.",
                location: "Amsterdam",
                rating: 5,
                text: "Ongelooflijk tevreden met mijn hangmat! De kwaliteit is echt top en het comfort is ongeëvenaard. Elke dag genieten in de tuin!",
                product: "Premium Hangmat",
              },
              {
                name: "Mark V.",
                location: "Rotterdam",
                rating: 5,
                text: "De strandhanddoeken zijn zo zacht en drogen super snel. Perfect voor onze vakantie in Spanje. Zeker een aanrader!",
                product: "Luxe Strandhanddoek",
              },
              {
                name: "Lisa K.",
                location: "Utrecht",
                rating: 5,
                text: "Complete strandset gekocht en wat een waarde voor geld! Alles wat je nodig hebt voor een perfecte stranddag. Top service ook!",
                product: "Complete Strandset",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>

                  <p className="text-lg mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-lg">
                        {testimonial.name}
                      </div>
                      <div className="text-white/70 text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {testimonial.location}
                      </div>
                    </div>
                    <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30">
                      {testimonial.product}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Ultra Premium */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto">
            {/* Animated Icon */}
            <div className="relative mb-8">
              <Sun className="w-20 h-20 mx-auto text-yellow-300 animate-spin-slow" />
              <div className="absolute inset-0 bg-yellow-300/20 rounded-full blur-2xl animate-pulse"></div>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Klaar Voor Jouw
              <span className="block text-yellow-300">Perfecte Stranddag?</span>
            </h2>

            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Ontdek onze volledige collectie en maak van elke dag een vakantie.
              <strong className="text-yellow-300"> Gratis verzending</strong> en
              <strong className="text-yellow-300"> 30 dagen retourrecht</strong>
              !
            </p>

            {/* Final Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {[
                { number: "5000+", label: "Tevreden klanten", icon: Users },
                { number: "4.9/5", label: "Gemiddelde review", icon: Star },
                {
                  number: `${featuredProducts.length}+`,
                  label: "Premium producten",
                  icon: Crown,
                },
                { number: "24u", label: "Express levering", icon: Clock },
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <stat.icon className="w-6 h-6 text-yellow-300 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-3xl md:text-4xl font-black text-white">
                      {stat.number}
                    </div>
                  </div>
                  <div className="text-white/80 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/shop">
                <Button
                  size="lg"
                  className="relative overflow-hidden bg-white text-slate-900 hover:bg-slate-100 px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 group min-w-[300px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Crown className="w-6 h-6 mr-3 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="relative z-10">Start Met Shoppen</span>
                  <ArrowRight className="w-6 h-6 ml-3 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>

              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-12 py-6 rounded-2xl text-xl font-semibold transition-all duration-300 min-w-[300px] backdrop-blur-sm bg-transparent"
                >
                  <Phone className="w-6 h-6 mr-3" />
                  Vragen? Contact Ons
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4" />
                <span>Gratis verzending vanaf €50</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>30 dagen retourrecht</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Premium kwaliteitsgarantie</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-slate-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900/50 to-slate-900"></div>

        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-6">
              <Link href="/" className="group">
                <Image
                  src="/logo-main.png"
                  alt="Cocúfum Logo"
                  width={150}
                  height={50}
                  className="h-12 w-auto brightness-0 invert group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="text-slate-400">
                <div className="font-semibold text-white">
                  Premium Beach Lifestyle
                </div>
                <div className="text-sm">Sinds 2020 • Nederland's #1</div>
              </div>
            </div>

            <div className="flex items-center gap-8 text-sm text-slate-400">
              <Link
                href="/privacy-policy"
                className="hover:text-white transition-colors duration-300 flex items-center gap-1"
              >
                <Shield className="w-3 h-3" />
                Privacy
              </Link>
              <Link
                href="/algemene-voorwaarden"
                className="hover:text-white transition-colors duration-300"
              >
                Voorwaarden
              </Link>
              <Link
                href="/contact"
                className="hover:text-white transition-colors duration-300 flex items-center gap-1"
              >
                <Mail className="w-3 h-3" />
                Contact
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              &copy; 2025 Cocúfum. Alle rechten voorbehouden.
              <span className="text-red-400 mx-2">❤️</span>
              Made with love in Nederland.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
