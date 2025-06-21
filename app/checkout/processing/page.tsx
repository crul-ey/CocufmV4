"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard, Shield, Clock } from "lucide-react";

export default function CheckoutProcessingPage() {
  const router = useRouter();
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    // Simulate processing time (in real app, this would be handled by webhooks)
    const timeout = setTimeout(() => {
      // In real implementation, you'd check the actual payment status
      // For demo purposes, we'll redirect to success after 5 seconds
      router.push("/checkout/success");
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/10 dark:via-stone-900 dark:to-purple-900/10 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Processing Animation */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Loader2 className="w-16 h-16 text-white animate-spin" />
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4">
          Betaling Verwerken{dots}
        </h1>
        <p className="text-xl text-stone-600 dark:text-stone-400 mb-8">
          Even geduld, we verwerken je betaling veilig
        </p>

        {/* Processing Steps */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 p-8 mb-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span className="text-stone-900 dark:text-stone-100 font-medium">
                Betalingsgegevens ontvangen
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
              <span className="text-stone-900 dark:text-stone-100 font-medium">
                Betaling wordt geverifieerd
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-stone-200 dark:bg-stone-700 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-stone-400" />
              </div>
              <span className="text-stone-500 dark:text-stone-400">
                Bestelling wordt bevestigd
              </span>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="font-bold text-stone-900 dark:text-stone-100">
              Veilige Betaling
            </span>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Je betaling wordt verwerkt via onze beveiligde SSL-verbinding. Sluit
            deze pagina niet af tijdens het proces.
          </p>
        </div>

        {/* Loading Bar */}
        <div className="mt-8">
          <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse"
              style={{ width: "75%" }}
            ></div>
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
            Dit kan tot 30 seconden duren...
          </p>
        </div>
      </div>
    </div>
  );
}
