import Link from "next/link";
import {
  CheckCircle,
  Package,
  Truck,
  Mail,
  ArrowRight,
  Home,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Bestelling Geplaatst! - Cocúfum",
  description:
    "Je bestelling is succesvol geplaatst. Bedankt voor je vertrouwen!",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-green-900/10 dark:via-stone-900 dark:to-blue-900/10 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-lg">🎉</span>
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            Bestelling Geplaatst! ✨
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 mb-2">
            Bedankt voor je vertrouwen in Cocúfum
          </p>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm">
            Bevestiging verstuurd naar je e-mail
          </Badge>
        </div>

        {/* Order Details Card */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6 flex items-center gap-3">
            <Package className="w-6 h-6 text-blue-600" />
            Je Bestelling
          </h2>

          {/* Order Status Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">
                Bestelling Ontvangen
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                We hebben je bestelling ontvangen
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">
                Wordt Ingepakt
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Je producten worden zorgvuldig ingepakt
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-stone-200 dark:bg-stone-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-stone-400" />
              </div>
              <h3 className="font-semibold text-stone-600 dark:text-stone-400 mb-1">
                Onderweg
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-500">
                Binnen 2-3 werkdagen bij je thuis
              </p>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Wat gebeurt er nu?
            </h3>
            <ul className="space-y-3 text-stone-700 dark:text-stone-300">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Je ontvangt binnen 5 minuten een bevestigingsmail met je
                  orderdetails
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  We sturen je een track & trace code zodra je bestelling
                  onderweg is
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Je bestelling wordt binnen 2-3 werkdagen bezorgd</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="btn-primary text-lg py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Terug naar Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="btn-secondary text-lg py-4 px-8 rounded-xl"
          >
            <Link href="/shop" className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Verder Winkelen
            </Link>
          </Button>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8 p-6 bg-stone-100 dark:bg-stone-800 rounded-xl">
          <p className="text-stone-600 dark:text-stone-400 mb-2">
            Vragen over je bestelling?
          </p>
          <Button
            asChild
            variant="ghost"
            className="text-blue-600 hover:text-blue-700"
          >
            <Link href="/contact">
              Neem contact met ons op <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
