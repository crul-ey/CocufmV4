import { getProducts } from "@/lib/shopify";
import ProductCard from "@/components/product-card";
import Header from "@/components/header";
import CartDrawer from "@/components/cart-drawer";
import { Gift, Heart, Star } from "lucide-react";

export const metadata = {
  title: "Cadeaus - Cocúfum",
  description:
    "Ontdek onze unieke collectie cadeauartikelen. Perfect voor elke gelegenheid.",
};

export default async function CadeausPage() {
  const products = await getProducts(16);
  // Filter products with 'cadeau' or 'gift' tags
  const giftProducts = products.filter((product) =>
    product.tags.some(
      (tag) =>
        tag.toLowerCase().includes("cadeau") ||
        tag.toLowerCase().includes("gift") ||
        tag.toLowerCase().includes("present")
    )
  );

  return (
    <>
      <Header />
      <CartDrawer />

      <main>
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-stone-50 to-stone-100">
          <div className="container text-center">
            <div className="max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-stone-800 to-stone-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Gift className="w-8 h-8 text-white" />
              </div>

              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-stone-900 mb-6">
                Unieke Cadeaus
              </h1>

              <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                Ontdek onze selectie van producten die perfect zijn als cadeau.
                Luxe parfums en lifestyle producten voor elke gelegenheid.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Thoughtful</span>
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Premium</span>
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full">
                  <Gift className="w-4 h-4 text-stone-600" />
                  <span>Perfect Gift</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gift Categories */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-stone-900 mb-4">
                Cadeaus per Gelegenheid
              </h2>
              <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                Of het nu voor een verjaardag, jubileum of gewoon omdat het kan
                - wij hebben het perfecte cadeau.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                {
                  title: "Verjaardag",
                  description: "Maak elke verjaardag onvergetelijk",
                  icon: "🎂",
                  color: "from-pink-100 to-pink-200",
                },
                {
                  title: "Jubileum",
                  description: "Vier bijzondere momenten samen",
                  icon: "💍",
                  color: "from-purple-100 to-purple-200",
                },
                {
                  title: "Housewarming",
                  description: "Verwelkom in het nieuwe thuis",
                  icon: "🏠",
                  color: "from-blue-100 to-blue-200",
                },
                {
                  title: "Zomaar",
                  description: "Omdat je aan iemand denkt",
                  icon: "💝",
                  color: "from-green-100 to-green-200",
                },
              ].map((category, index) => (
                <div
                  key={index}
                  className={`card p-6 bg-gradient-to-br ${category.color} border-0`}
                >
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-stone-600 text-sm">
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gift Products */}
        <section className="py-16 lg:py-24 bg-stone-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-stone-900 mb-4">
                Onze Cadeaucollectie
              </h2>
              <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                Ontdek producten die perfect zijn om cadeau te geven aan je
                dierbaren.
              </p>
            </div>

            {giftProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {giftProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {products.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
