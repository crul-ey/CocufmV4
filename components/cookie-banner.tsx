"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { X, Settings, Cookie, Shield, BarChart3, Target } from "lucide-react";
import Link from "next/link";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookie-consent");
    if (!cookieConsent) {
      setIsVisible(true);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(cookieConsent);
        setPreferences(savedPreferences);
      } catch (error) {
        console.error("Error parsing cookie preferences:", error);
        setIsVisible(true);
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem("cookie-consent", JSON.stringify(prefs));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());

    // Set individual cookie flags for other scripts to check
    localStorage.setItem("analytics-enabled", prefs.analytics.toString());
    localStorage.setItem("marketing-enabled", prefs.marketing.toString());
    localStorage.setItem("functional-enabled", prefs.functional.toString());

    setPreferences(prefs);
    setIsVisible(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    savePreferences(allAccepted);
  };

  const acceptEssentialOnly = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    savePreferences(essentialOnly);
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === "essential") return; // Cannot disable essential cookies
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      <Card className="w-full max-w-4xl bg-white dark:bg-stone-900 shadow-2xl border-2 border-orange-200 dark:border-orange-800 pointer-events-auto">
        <div className="p-6">
          {!showSettings ? (
            // Main Cookie Banner
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Cookie className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                    🍪 Wij gebruiken cookies
                  </h3>
                  <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
                    Wij gebruiken cookies om uw ervaring te verbeteren, website
                    statistieken bij te houden en gepersonaliseerde advertenties
                    te tonen. Door op "Alles accepteren" te klikken, gaat u
                    akkoord met ons gebruik van cookies zoals beschreven in onze{" "}
                    <Link
                      href="/cookie-policy"
                      className="text-orange-600 hover:underline font-medium"
                    >
                      Cookie Policy
                    </Link>{" "}
                    en{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-orange-600 hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={acceptAll}
                  className="bg-orange-600 hover:bg-orange-700 text-white flex-1 sm:flex-none"
                >
                  🎯 Alles accepteren
                </Button>
                <Button
                  onClick={acceptEssentialOnly}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  ✅ Alleen essentieel
                </Button>
                <Button
                  onClick={() => setShowSettings(true)}
                  variant="ghost"
                  className="flex-1 sm:flex-none"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Instellingen
                </Button>
              </div>
            </div>
          ) : (
            // Cookie Settings Panel
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  Cookie Instellingen
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-stone-700 dark:text-stone-300 text-sm">
                Kies welke cookies u wilt accepteren. U kunt deze instellingen
                op elk moment wijzigen.
              </p>

              <div className="space-y-4">
                {/* Essential Cookies */}
                <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex-shrink-0 p-2 bg-green-100 dark:bg-green-900 rounded">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-green-800 dark:text-green-200">
                        Essentiële Cookies
                      </h4>
                      <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                        Altijd Aan
                      </div>
                    </div>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Deze cookies zijn noodzakelijk voor het functioneren van
                      de website. Ze kunnen niet worden uitgeschakeld.
                    </p>
                    <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                      Winkelwagen, beveiliging, voorkeuren
                    </p>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900 rounded">
                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                        Analytics Cookies
                      </h4>
                      <Switch
                        checked={preferences.analytics}
                        onCheckedChange={(checked) =>
                          updatePreference("analytics", checked)
                        }
                      />
                    </div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Helpen ons begrijpen hoe bezoekers onze website gebruiken,
                      zodat we deze kunnen verbeteren.
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                      Google Analytics, Hotjar
                    </p>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start gap-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex-shrink-0 p-2 bg-purple-100 dark:bg-purple-900 rounded">
                    <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-200">
                        Marketing Cookies
                      </h4>
                      <Switch
                        checked={preferences.marketing}
                        onCheckedChange={(checked) =>
                          updatePreference("marketing", checked)
                        }
                      />
                    </div>
                    <p className="text-purple-700 dark:text-purple-300 text-sm">
                      Gebruikt voor gepersonaliseerde advertenties en het meten
                      van advertentie-effectiviteit.
                    </p>
                    <p className="text-purple-600 dark:text-purple-400 text-xs mt-1">
                      Google Ads, Facebook Pixel, TikTok Pixel
                    </p>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex-shrink-0 p-2 bg-orange-100 dark:bg-orange-900 rounded">
                    <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200">
                        Functionele Cookies
                      </h4>
                      <Switch
                        checked={preferences.functional}
                        onCheckedChange={(checked) =>
                          updatePreference("functional", checked)
                        }
                      />
                    </div>
                    <p className="text-orange-700 dark:text-orange-300 text-sm">
                      Verbeteren de functionaliteit en personalisatie van de
                      website.
                    </p>
                    <p className="text-orange-600 dark:text-orange-400 text-xs mt-1">
                      Verlanglijst, recent bekeken, taalvoorkeur
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  onClick={saveCustomPreferences}
                  className="bg-orange-600 hover:bg-orange-700 text-white flex-1"
                >
                  💾 Voorkeuren opslaan
                </Button>
                <Button
                  onClick={acceptAll}
                  variant="outline"
                  className="flex-1"
                >
                  🎯 Alles accepteren
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Meer informatie in onze{" "}
                  <Link
                    href="/cookie-policy"
                    className="text-orange-600 hover:underline"
                  >
                    Cookie Policy
                  </Link>{" "}
                  en{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-orange-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
