import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie policy van Cocúfum - hoe wij cookies gebruiken op onze website.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            Cookie Policy
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Laatst bijgewerkt: {new Date().toLocaleDateString("nl-NL")} |
            ePrivacy Compliant 2025
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-lg shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              1. Wat zijn cookies?
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p>
                Cookies zijn kleine tekstbestanden die op uw apparaat worden
                opgeslagen wanneer u onze website bezoekt. Ze helpen ons de
                website te laten functioneren, uw ervaring te verbeteren en
                inzicht te krijgen in hoe onze website wordt gebruikt.
              </p>
              <p>Wij gebruiken ook vergelijkbare technologieën zoals:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  <strong>Local Storage:</strong> Voor het opslaan van
                  voorkeuren
                </li>
                <li>
                  <strong>Session Storage:</strong> Voor tijdelijke gegevens
                  tijdens uw bezoek
                </li>
                <li>
                  <strong>Web Beacons:</strong> Voor het meten van e-mail
                  interacties
                </li>
                <li>
                  <strong>Pixels:</strong> Voor tracking en analytics
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              2. Welke cookies gebruiken wij?
            </h2>
            <div className="space-y-6 text-stone-700 dark:text-stone-300">
              <div className="bg-green-50 dark:bg-stone-800 p-6 rounded-lg border-l-4 border-green-400">
                <h3 className="text-xl font-semibold mb-3 text-green-800 dark:text-green-300">
                  ✅ Essentiële Cookies (Altijd actief)
                </h3>
                <p className="mb-3">
                  Deze cookies zijn noodzakelijk voor het functioneren van de
                  website en kunnen niet worden uitgeschakeld.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-green-200 dark:border-green-700 text-sm">
                    <thead>
                      <tr className="bg-green-100 dark:bg-green-900">
                        <th className="border border-green-200 dark:border-green-700 p-2 text-left">
                          Cookie
                        </th>
                        <th className="border border-green-200 dark:border-green-700 p-2 text-left">
                          Doel
                        </th>
                        <th className="border border-green-200 dark:border-green-700 p-2 text-left">
                          Duur
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-green-200 dark:border-green-700 p-2">
                          cart_session
                        </td>
                        <td className="border border-green-200 dark:border-green-700 p-2">
                          Winkelwagen inhoud bewaren
                        </td>
                        <td className="border border-green-200 dark:border-green-700 p-2">
                          Sessie
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-green-200 dark:border-green-700 p-2">
                          theme_preference
                        </td>
                        <td className="border border-green-200 dark:border-green-700 p-2">
                          Donkere/lichte modus
                        </td>
                        <td className="border border-green-200 dark:border-green-700 p-2">
                          1 jaar
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-green-200 dark:border-green-700 p-2">
                          cookie_consent
                        </td>
                        <td className="border border-green-200 dark:border-green-700 p-2">
                          Cookie voorkeuren onthouden
                        </td>
                        <td className="border border-green-200 dark:border-green-700 p-2">
                          1 jaar
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-green-200 dark:border-green-700 p-2">
                          csrf_token
                        </td>
                        <td className="border border-green-200 dark:border-green-700 p-2">
                          Beveiliging tegen aanvallen
                        </td>
                        <td className="border border-green-200 dark:border-green-700 p-2">
                          Sessie
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-stone-800 p-6 rounded-lg border-l-4 border-blue-400">
                <h3 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-300">
                  📊 Analytics Cookies (Toestemming vereist)
                </h3>
                <p className="mb-3">
                  Deze cookies helpen ons begrijpen hoe bezoekers onze website
                  gebruiken.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-blue-200 dark:border-blue-700 text-sm">
                    <thead>
                      <tr className="bg-blue-100 dark:bg-blue-900">
                        <th className="border border-blue-200 dark:border-blue-700 p-2 text-left">
                          Service
                        </th>
                        <th className="border border-blue-200 dark:border-blue-700 p-2 text-left">
                          Cookies
                        </th>
                        <th className="border border-blue-200 dark:border-blue-700 p-2 text-left">
                          Doel
                        </th>
                        <th className="border border-blue-200 dark:border-blue-700 p-2 text-left">
                          Duur
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-blue-200 dark:border-blue-700 p-2">
                          Google Analytics
                        </td>
                        <td className="border border-blue-200 dark:border-blue-700 p-2">
                          _ga, _ga_*, _gid
                        </td>
                        <td className="border border-blue-200 dark:border-blue-700 p-2">
                          Website statistieken
                        </td>
                        <td className="border border-blue-200 dark:border-blue-700 p-2">
                          2 jaar / 24 uur
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-blue-200 dark:border-blue-700 p-2">
                          Hotjar
                        </td>
                        <td className="border border-blue-200 dark:border-blue-700 p-2">
                          _hjid, _hjSession*
                        </td>
                        <td className="border border-blue-200 dark:border-blue-700 p-2">
                          Gebruikerservaring analyse
                        </td>
                        <td className="border border-blue-200 dark:border-blue-700 p-2">
                          1 jaar / 30 min
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-stone-800 p-6 rounded-lg border-l-4 border-purple-400">
                <h3 className="text-xl font-semibold mb-3 text-purple-800 dark:text-purple-300">
                  🎯 Marketing Cookies (Toestemming vereist)
                </h3>
                <p className="mb-3">
                  Deze cookies worden gebruikt voor gepersonaliseerde
                  advertenties en marketing.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-purple-200 dark:border-purple-700 text-sm">
                    <thead>
                      <tr className="bg-purple-100 dark:bg-purple-900">
                        <th className="border border-purple-200 dark:border-purple-700 p-2 text-left">
                          Service
                        </th>
                        <th className="border border-purple-200 dark:border-purple-700 p-2 text-left">
                          Cookies
                        </th>
                        <th className="border border-purple-200 dark:border-purple-700 p-2 text-left">
                          Doel
                        </th>
                        <th className="border border-purple-200 dark:border-purple-700 p-2 text-left">
                          Duur
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-purple-200 dark:border-purple-700 p-2">
                          Google Ads
                        </td>
                        <td className="border border-purple-200 dark:border-purple-700 p-2">
                          _gcl_au, _gac_*
                        </td>
                        <td className="border border-purple-200 dark:border-purple-700 p-2">
                          Advertentie targeting
                        </td>
                        <td className="border border-purple-200 dark:border-purple-700 p-2">
                          90 dagen
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-purple-200 dark:border-purple-700 p-2">
                          Facebook Pixel
                        </td>
                        <td className="border border-purple-200 dark:border-purple-700 p-2">
                          _fbp, _fbc
                        </td>
                        <td className="border border-purple-200 dark:border-purple-700 p-2">
                          Social media advertenties
                        </td>
                        <td className="border border-purple-200 dark:border-purple-700 p-2">
                          90 dagen
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-purple-200 dark:border-purple-700 p-2">
                          TikTok Pixel
                        </td>
                        <td className="border border-purple-200 dark:border-purple-700 p-2">
                          _ttp
                        </td>
                        <td className="border border-purple-200 dark:border-purple-700 p-2">
                          TikTok advertenties
                        </td>
                        <td className="border border-purple-200 dark:border-purple-700 p-2">
                          13 maanden
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-stone-800 p-6 rounded-lg border-l-4 border-orange-400">
                <h3 className="text-xl font-semibold mb-3 text-orange-800 dark:text-orange-300">
                  ⚙️ Functionele Cookies (Toestemming vereist)
                </h3>
                <p className="mb-3">
                  Deze cookies verbeteren de functionaliteit en personalisatie
                  van de website.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-orange-200 dark:border-orange-700 text-sm">
                    <thead>
                      <tr className="bg-orange-100 dark:bg-orange-900">
                        <th className="border border-orange-200 dark:border-orange-700 p-2 text-left">
                          Cookie
                        </th>
                        <th className="border border-orange-200 dark:border-orange-700 p-2 text-left">
                          Doel
                        </th>
                        <th className="border border-orange-200 dark:border-orange-700 p-2 text-left">
                          Duur
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-orange-200 dark:border-orange-700 p-2">
                          wishlist_items
                        </td>
                        <td className="border border-orange-200 dark:border-orange-700 p-2">
                          Verlanglijst bewaren
                        </td>
                        <td className="border border-orange-200 dark:border-orange-700 p-2">
                          30 dagen
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-orange-200 dark:border-orange-700 p-2">
                          recently_viewed
                        </td>
                        <td className="border border-orange-200 dark:border-orange-700 p-2">
                          Recent bekeken producten
                        </td>
                        <td className="border border-orange-200 dark:border-orange-700 p-2">
                          7 dagen
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-orange-200 dark:border-orange-700 p-2">
                          language_preference
                        </td>
                        <td className="border border-orange-200 dark:border-orange-700 p-2">
                          Taalvoorkeur
                        </td>
                        <td className="border border-orange-200 dark:border-orange-700 p-2">
                          1 jaar
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              3. Uw Cookie Voorkeuren
            </h2>
            <div className="space-y-4 text-stone-700 dark:text-stone-300">
              <p>U heeft volledige controle over welke cookies u accepteert:</p>

              <div className="bg-stone-50 dark:bg-stone-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">
                  🎛️ Cookie Instellingen Beheren
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-stone-700 rounded border">
                    <div>
                      <p className="font-medium">Essentiële Cookies</p>
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        Altijd vereist voor website functionaliteit
                      </p>
                    </div>
                    <div className="text-green-600 font-medium">Altijd Aan</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-stone-700 rounded border">
                    <div>
                      <p className="font-medium">Analytics Cookies</p>
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        Help ons de website te verbeteren
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Beheren
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-stone-700 rounded border">
                    <div>
                      <p className="font-medium">Marketing Cookies</p>
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        Voor gepersonaliseerde advertenties
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Beheren
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-stone-700 rounded border">
                    <div>
                      <p className="font-medium">Functionele Cookies</p>
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        Voor verbeterde gebruikerservaring
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Beheren
                    </Button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
                    U kunt uw voorkeuren op elk moment wijzigen via de cookie
                    banner of browser instellingen.
                  </p>
                  <Button className="w-full">
                    Cookie Voorkeuren Opnieuw Instellen
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              4. Browser Instellingen
            </h2>
            <div className="space-y-4 text-stone-700 dark:text-stone-300">
              <p>U kunt cookies ook beheren via uw browser instellingen:</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-stone-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">🌐 Google Chrome</h3>
                  <p className="text-sm">
                    Instellingen → Privacy en beveiliging → Cookies en andere
                    sitegegevens
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-stone-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">🦊 Mozilla Firefox</h3>
                  <p className="text-sm">
                    Instellingen → Privacy en beveiliging → Cookies en
                    sitegegevens
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-stone-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">🧭 Safari</h3>
                  <p className="text-sm">
                    Voorkeuren → Privacy → Cookies en websitegegevens
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-stone-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">🌊 Microsoft Edge</h3>
                  <p className="text-sm">
                    Instellingen → Cookies en sitemachtigingen → Cookies en
                    sitegegevens
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-stone-800 p-4 rounded-lg border-l-4 border-amber-400">
                <p>
                  <strong>⚠️ Let op:</strong> Het uitschakelen van alle cookies
                  kan de functionaliteit van onze website beperken.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              5. Third-Party Cookies
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p>Onze website kan cookies van derde partijen bevatten:</p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-stone-300 dark:border-stone-600">
                  <thead>
                    <tr className="bg-stone-100 dark:bg-stone-800">
                      <th className="border border-stone-300 dark:border-stone-600 p-3 text-left">
                        Derde Partij
                      </th>
                      <th className="border border-stone-300 dark:border-stone-600 p-3 text-left">
                        Doel
                      </th>
                      <th className="border border-stone-300 dark:border-stone-600 p-3 text-left">
                        Privacy Policy
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        Google Analytics
                      </td>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        Website statistieken
                      </td>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        <a
                          href="https://policies.google.com/privacy"
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          Google Privacy Policy
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        Facebook
                      </td>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        Social media integratie
                      </td>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        <a
                          href="https://www.facebook.com/privacy/policy/"
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          Facebook Privacy Policy
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        Shopify
                      </td>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        E-commerce functionaliteit
                      </td>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        <a
                          href="https://www.shopify.com/legal/privacy"
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          Shopify Privacy Policy
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              6. Updates en Wijzigingen
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p>
                Wij kunnen deze cookie policy bijwerken om te voldoen aan nieuwe
                wetgeving of bij wijzigingen in onze cookie gebruik.
              </p>
              <p>Belangrijke wijzigingen communiceren wij via:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Update van de cookie banner</li>
                <li>E-mail notificatie (indien u ingeschreven bent)</li>
                <li>Melding op onze website</li>
              </ul>
              <p>
                Wij adviseren u deze pagina regelmatig te controleren voor
                updates.
              </p>
            </div>
          </section>

          <section className="border-t pt-6">
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              Contact
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p>
                Heeft u vragen over ons cookie gebruik? Neem contact met ons op:
              </p>
              <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-lg">
                <ul className="space-y-2">
                  <li>
                    <strong>E-mail:</strong> privacy@cocufum.com
                  </li>
                  <li>
                    <strong>Website:</strong> www.cocufum.com
                  </li>
                  <li>
                    <strong>Bedrijf:</strong> crul.dev (handelsnaam: Cocúfum)
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="border-t pt-6">
            <div className="text-center text-stone-600 dark:text-stone-400">
              <p>
                Deze cookie policy voldoet aan de ePrivacy Directive en GDPR
                wetgeving
              </p>
              <p className="text-sm mt-2">
                Laatst bijgewerkt: {new Date().toLocaleDateString("nl-NL")}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
