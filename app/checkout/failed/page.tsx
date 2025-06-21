import Link from "next/link";
import {
  XCircle,
  RefreshCw,
  ArrowLeft,
  Mail,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Betaling Mislukt - Cocúfum",
  description:
    "Er ging iets mis met je betaling. Probeer het opnieuw of neem contact met ons op.",
};

export default function CheckoutFailedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-900/10 dark:via-stone-900 dark:to-orange-900/10 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Error Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <XCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full flex items-center justify-center animate-bounce">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            Oeps! Er ging iets mis 😔
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 mb-6">
            Je betaling kon niet worden verwerkt
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6 flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-red-600" />
            Wat is er gebeurd?
          </h2>

          <div className="space-y-4 mb-8">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-red-200 dark:border-red-700">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-3">
                Mogelijke oorzaken:
              </h3>
              <ul className="space-y-2 text-stone-700 dark:text-stone-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Onvoldoende saldo op je rekening of creditcard</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Verkeerde betalingsgegevens ingevoerd</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Tijdelijke storing bij de betalingsprovider</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Je bank heeft de betaling geblokkeerd</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-3">
                Geen zorgen! 💪
              </h3>
              <ul className="space-y-2 text-stone-700 dark:text-stone-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Je winkelwagen is bewaard - niets is verloren</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Er is geen geld van je rekening afgeschreven</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Je kunt het direct opnieuw proberen</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <RefreshCw className="w-5 h-5 mr-2" />
            Opnieuw Proberen
          </Button>

          <Button
            asChild
            variant="outline"
            className="btn-secondary text-lg py-4 px-8 rounded-xl"
          >
            <Link href="/shop" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Terug naar Winkelwagen
            </Link>
          </Button>
        </div>

        {/* Alternative Payment Methods */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 p-6 mb-8">
          <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-4">
            Andere betaalmethoden proberen:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-stone-50 dark:bg-stone-700 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-600 transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-blue-600 rounded mx-auto mb-2"></div>
              <span className="text-sm font-medium">iDEAL</span>
            </div>
            <div className="text-center p-4 bg-stone-50 dark:bg-stone-700 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-600 transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-yellow-500 rounded mx-auto mb-2"></div>
              <span className="text-sm font-medium">PayPal</span>
            </div>
            <div className="text-center p-4 bg-stone-50 dark:bg-stone-700 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-600 transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-black rounded mx-auto mb-2"></div>
              <span className="text-sm font-medium">Apple Pay</span>
            </div>
            <div className="text-center p-4 bg-stone-50 dark:bg-stone-700 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-600 transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-green-600 rounded mx-auto mb-2"></div>
              <span className="text-sm font-medium">Bancontact</span>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className="text-center p-6 bg-stone-100 dark:bg-stone-800 rounded-xl">
          <p className="text-stone-600 dark:text-stone-400 mb-4">
            Blijft het niet lukken? Ons team helpt je graag! 🤝
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              variant="ghost"
              className="text-blue-600 hover:text-blue-700"
            >
              <Link href="/contact" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-mail Support
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
