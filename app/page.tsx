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
  Star,
  Sun,
  Waves,
  Umbrella,
  Gift,
  Users,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/shopify";

export default async function HomePage() {
  const featuredProducts = await getProducts(8);

  return (
    <>
      <EnhancedHeader />
      <EnhancedCartDrawer />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* USPs Section */}
        <section className="section-padding bg-white dark:bg-stone-900">
          <div className="container">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="heading-md text-stone-900 dark:text-stone-100 mb-4">
                Waarom Kiezen Voor{" "}
                <span className="text-gradient bg-gradient-to-r from-blue-600 via-orange-500 to-green-600 bg-clip-text text-transparent">
                  Cocúfum
                </span>
              </h2>
              <p className="body-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                Jouw partner voor de perfecte zomer met premium kwaliteit en
                service
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  icon: Truck,
                  title: "Gratis Verzending",
                  description:
                    "Gratis verzending binnen Nederland vanaf €75. Snelle levering binnen 2-3 werkdagen.",
                  color: "text-blue-600",
                },
                {
                  icon: Shield,
                  title: "Kwaliteitsgarantie",
                  description:
                    "14 dagen retourrecht. Niet tevreden? Geld terug garantie op al onze producten.",
                  color: "text-green-600",
                },
                {
                  icon: Leaf,
                  title: "Duurzaam & Eco",
                  description:
                    "Milieuvriendelijke materialen en duurzame productie. Goed voor jou en de planeet.",
                  color: "text-emerald-600",
                },
                {
                  icon: Sun,
                  title: "Zomer Specialist",
                  description:
                    "Gespecialiseerd in zomerproducten en strandaccessoires van topkwaliteit.",
                  color: "text-orange-600",
                },
                {
                  icon: Users,
                  title: "Klantenservice",
                  description:
                    "Persoonlijk advies en uitstekende klantenservice voor al je vragen.",
                  color: "text-purple-600",
                },
                {
                  icon: Globe,
                  title: "Wereldwijde Trends",
                  description:
                    "De nieuwste trends en designs van over de hele wereld, speciaal voor jou geselecteerd.",
                  color: "text-pink-600",
                },
              ].map((usp, index) => (
                <div
                  key={index}
                  className="text-center group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-stone-100 to-stone-50 dark:from-stone-800 dark:to-stone-700 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <usp.icon className={`w-10 h-10 ${usp.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
                    {usp.title}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {usp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="section-padding bg-gradient-to-br from-blue-50 via-orange-50 to-green-50 dark:from-blue-950/20 dark:via-orange-950/20 dark:to-green-950/20">
          <div className="container">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="heading-md text-stone-900 dark:text-stone-100 mb-4">
                Zomer{" "}
                <span className="text-gradient bg-gradient-to-r from-blue-600 via-orange-500 to-green-600 bg-clip-text text-transparent">
                  Collectie
                </span>
              </h2>
              <p className="body-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                Ontdek onze meest populaire zomerproducten, perfect voor strand,
                zwembad en vakantie
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <EnhancedProductCard product={product} priority={index < 2} />
                </div>
              ))}
            </div>

            <div className="text-center mt-16 animate-fade-in-up">
              <Button asChild className="btn-summer group">
                <Link href="/shop">
                  Bekijk Alle Producten
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="section-padding bg-white dark:bg-stone-900">
          <div className="container">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="heading-md text-stone-900 dark:text-stone-100 mb-4">
                Shop per{" "}
                <span className="text-gradient bg-gradient-to-r from-blue-600 via-orange-500 to-green-600 bg-clip-text text-transparent">
                  Categorie
                </span>
              </h2>
              <p className="body-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                Vind precies wat je zoekt voor jouw perfecte zomer
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Waves,
                  title: "Strandhanddoeken",
                  description:
                    "Luxe, zachte handdoeken perfect voor strand en zwembad",
                  image: "/strandhandoek.png",
                  link: "/shop?category=strandhanddoeken",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: Umbrella,
                  title: "Strand Accessoires",
                  description:
                    "Alles wat je nodig hebt voor de perfecte stranddag",
                  image: "/strandspul.png",
                  link: "/shop?category=strand-accessoires",
                  color: "from-orange-500 to-yellow-500",
                },
                {
                  icon: Gift,
                  title: "Lifestyle & Cadeaus",
                  description: "Unieke lifestyle producten en perfecte cadeaus",
                  image: "/hangmat.png",
                  link: "/cadeaus",
                  color: "from-green-500 to-emerald-500",
                },
              ].map((category, index) => (
                <Link
                  key={index}
                  href={category.link}
                  className="group block animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card card-hover relative overflow-hidden">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-30 group-hover:opacity-40 transition-opacity duration-300`}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <category.icon className="w-6 h-6 text-stone-700 dark:text-stone-300 mr-3" />
                        <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                          {category.title}
                        </h3>
                      </div>
                      <p className="text-stone-600 dark:text-stone-400 mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors">
                        <span className="font-medium">Shop nu</span>
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section-padding bg-gradient-to-br from-blue-50 via-orange-50 to-green-50 dark:from-blue-950/20 dark:via-orange-950/20 dark:to-green-950/20">
          <div className="container">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="heading-md text-stone-900 dark:text-stone-100 mb-4">
                Wat Onze{" "}
                <span className="text-gradient bg-gradient-to-r from-blue-600 via-orange-500 to-green-600 bg-clip-text text-transparent">
                  Klanten
                </span>{" "}
                Zeggen
              </h2>
              <p className="body-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                Lees de ervaringen van onze tevreden klanten
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Emma van der Berg",
                  location: "Amsterdam",
                  text: "Prachtige strandhanddoeken! Super zachte kwaliteit en de kleuren zijn nog mooier dan op de foto's. Perfecte aankoop voor onze vakantie!",
                  rating: 5,
                  verified: true,
                },
                {
                  name: "Lars Janssen",
                  location: "Rotterdam",
                  text: "Snelle levering en uitstekende kwaliteit. De strandtas is ruim en stevig, precies wat ik zocht. Zeker een aanrader!",
                  rating: 5,
                  verified: true,
                },
                {
                  name: "Sophie Bakker",
                  location: "Utrecht",
                  text: "Geweldige service en mooie producten. Heb hier cadeaus gekocht en iedereen was er super blij mee. Top webshop!",
                  rating: 5,
                  verified: true,
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="card p-8 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    {testimonial.verified && (
                      <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                        Geverifieerd
                      </span>
                    )}
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 mb-6 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-stone-900 dark:text-stone-100">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="section-padding bg-gradient-to-br from-blue-600 via-orange-500 to-green-600 text-white">
          <div className="container text-center">
            <div className="max-w-3xl mx-auto animate-fade-in-up">
              <h2 className="heading-md mb-6">
                Blijf Op De Hoogte Van Onze{" "}
                <span className="text-yellow-300">Zomer Deals</span>
              </h2>
              <p className="body-lg mb-8 text-white/90">
                Ontvang exclusieve aanbiedingen, zomer tips en als eerste
                toegang tot nieuwe collecties
              </p>

              <p className="text-sm text-white/70 mt-4">
                Geen spam, alleen de beste zomer deals. Uitschrijven kan altijd.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-stone-950 text-white section-padding">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Logo variant="full" size="lg" />
              </div>
              <p className="text-stone-300 mb-6 max-w-md leading-relaxed">
                Cocúfum brengt je de mooiste zomerproducten en lifestyle
                artikelen. Van luxe strandhanddoeken tot unieke accessoires -
                wij maken jouw zomer perfect.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-stone-400 hover:text-white"
                >
                  Instagram
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-stone-400 hover:text-white"
                >
                  Facebook
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-stone-400 hover:text-white"
                >
                  TikTok
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="font-semibold mb-6 text-lg">Navigatie</h3>
              <ul className="space-y-3 text-stone-300">
                {[
                  { name: "Home", href: "/" },
                  { name: "Shop", href: "/shop" },
                  { name: "Cadeaus", href: "/cadeaus" },
                  { name: "Contact", href: "/contact" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service & Legal */}
            <div>
              <h3 className="font-semibold mb-6 text-lg">
                Service & Juridisch
              </h3>
              <ul className="space-y-3 text-stone-300">
                {[
                  {
                    name: "Algemene Voorwaarden",
                    href: "/algemene-voorwaarden",
                  },
                  { name: "Privacy Policy", href: "/privacy-policy" },
                  { name: "Cookie Policy", href: "/cookie-policy" },
                  { name: "FAQ", href: "/faq" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-stone-400 text-sm mb-4 md:mb-0">
              &copy; 2025 Cocúfum. Alle rechten voorbehouden.
            </p>
            <div className="flex items-center space-x-6 text-sm text-stone-400">
              <span>Contact: info@cocufum.com</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
