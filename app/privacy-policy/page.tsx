import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy van Cocúfum - hoe wij uw persoonlijke gegevens verwerken en beschermen.",
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Laatst bijgewerkt: {new Date().toLocaleDateString("nl-NL")} | GDPR
            Compliant 2025
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-lg shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              1. Wie zijn wij?
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p>
                <strong>Verwerkingsverantwoordelijke:</strong> crul.dev
                (handelsnaam: Cocúfum)
              </p>
              <p>
                <strong>Contactgegevens:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>E-mail: privacy@cocufum.com</li>
                <li>Website: www.cocufum.com</li>
                <li>KvK: [Uw KvK nummer]</li>
              </ul>
              <p>
                Wij respecteren uw privacy en handelen conform de Algemene
                Verordening Gegevensbescherming (AVG/GDPR).
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              2. Welke gegevens verzamelen wij?
            </h2>
            <div className="space-y-4 text-stone-700 dark:text-stone-300">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Persoonsgegevens bij bestelling:
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Voor- en achternaam</li>
                  <li>E-mailadres</li>
                  <li>Telefoonnummer</li>
                  <li>Factuur- en bezorgadres</li>
                  <li>Betalingsgegevens (via beveiligde betalingsproviders)</li>
                  <li>Bestelling- en productinformatie</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Technische gegevens:
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>IP-adres</li>
                  <li>Browser type en versie</li>
                  <li>Apparaat informatie</li>
                  <li>Pagina bezoeken en klikgedrag</li>
                  <li>Cookies en vergelijkbare technologieën</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Communicatie:</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>E-mailcorrespondentie</li>
                  <li>Klantenservice gesprekken</li>
                  <li>Feedback en reviews</li>
                  <li>Nieuwsbrief inschrijvingen</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              3. Waarom verwerken wij uw gegevens?
            </h2>
            <div className="space-y-4 text-stone-700 dark:text-stone-300">
              <div className="bg-orange-50 dark:bg-stone-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  Uitvoering overeenkomst:
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Verwerken en uitvoeren van bestellingen</li>
                  <li>Communicatie over uw bestelling</li>
                  <li>Levering via onze dropshipping partners</li>
                  <li>Afhandeling van retouren en klachten</li>
                  <li>Klantenservice en ondersteuning</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-stone-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  Wettelijke verplichtingen:
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Boekhouding en fiscale administratie</li>
                  <li>Garantie en gewährleistung</li>
                  <li>Consumentenbescherming</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-stone-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  Gerechtvaardigd belang:
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Website optimalisatie en analytics</li>
                  <li>Fraudepreventie en beveiliging</li>
                  <li>Marketing en productaanbevelingen</li>
                  <li>Verbetering van onze dienstverlening</li>
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-stone-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Toestemming:</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Nieuwsbrief en marketing e-mails</li>
                  <li>Niet-essentiële cookies</li>
                  <li>Gepersonaliseerde advertenties</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              4. Dropshipping en Gegevens Delen
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <div className="bg-amber-50 dark:bg-stone-800 p-4 rounded-lg border-l-4 border-amber-400">
                <p>
                  <strong>BELANGRIJK:</strong> Wij opereren volgens een
                  dropshipping model.
                </p>
              </div>
              <p>
                Voor de uitvoering van uw bestelling delen wij noodzakelijke
                gegevens met onze leveranciers:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  <strong>Verzendgegevens:</strong> Naam, adres, telefoonnummer
                </li>
                <li>
                  <strong>Productinformatie:</strong> Bestelde items,
                  hoeveelheden, specificaties
                </li>
                <li>
                  <strong>Leveringsinstructies:</strong> Speciale verzoeken of
                  opmerkingen
                </li>
              </ul>
              <p>Onze leveranciers zijn contractueel verplicht om:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Gegevens alleen te gebruiken voor levering</li>
                <li>Adequate beveiligingsmaatregelen te treffen</li>
                <li>Gegevens niet door te geven aan derden</li>
                <li>Gegevens te verwijderen na voltooiing levering</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              5. Cookies en Tracking
            </h2>
            <div className="space-y-4 text-stone-700 dark:text-stone-300">
              <p>
                Wij gebruiken verschillende soorten cookies. Zie onze{" "}
                <Link
                  href="/cookie-policy"
                  className="text-orange-600 hover:underline"
                >
                  Cookie Policy
                </Link>{" "}
                voor details.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-stone-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">✅ Essentiële Cookies</h3>
                  <p className="text-sm">
                    Noodzakelijk voor website functionaliteit. Geen toestemming
                    vereist.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-stone-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">📊 Analytics Cookies</h3>
                  <p className="text-sm">
                    Voor website statistieken en optimalisatie. Toestemming
                    vereist.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-stone-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">🎯 Marketing Cookies</h3>
                  <p className="text-sm">
                    Voor gepersonaliseerde advertenties. Toestemming vereist.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-stone-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">⚙️ Functionele Cookies</h3>
                  <p className="text-sm">
                    Voor verbeterde gebruikerservaring. Toestemming vereist.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              6. Bewaartermijnen
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-stone-300 dark:border-stone-600">
                  <thead>
                    <tr className="bg-stone-100 dark:bg-stone-800">
                      <th className="border border-stone-300 dark:border-stone-600 p-3 text-left">
                        Gegevenstype
                      </th>
                      <th className="border border-stone-300 dark:border-stone-600 p-3 text-left">
                        Bewaartermijn
                      </th>
                      <th className="border border-stone-300 dark:border-stone-600 p-3 text-left">
                        Reden
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        Bestelgegevens
                      </td>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        7 jaar
                      </td>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        Fiscale wetgeving
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        Klantgegevens
                      </td>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        3 jaar na laatste contact
                      </td>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        Klantenservice
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        Website analytics
                      </td>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        26 maanden
                      </td>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        Google Analytics
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        Marketing data
                      </td>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        Tot intrekking toestemming
                      </td>
                      <td className="border border-stone-300 dark:border-stone-600 p-3">
                        Toestemming basis
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              7. Uw Rechten (GDPR)
            </h2>
            <div className="space-y-4 text-stone-700 dark:text-stone-300">
              <p>
                U heeft de volgende rechten betreffende uw persoonsgegevens:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-stone-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">🔍 Recht op inzage</h3>
                  <p className="text-sm">
                    Weten welke gegevens wij van u hebben
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-stone-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">
                    ✏️ Recht op rectificatie
                  </h3>
                  <p className="text-sm">Onjuiste gegevens laten corrigeren</p>
                </div>

                <div className="bg-red-50 dark:bg-stone-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">
                    🗑️ Recht op verwijdering
                  </h3>
                  <p className="text-sm">
                    Uw gegevens laten wissen (recht op vergetelheid)
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-stone-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">⏸️ Recht op beperking</h3>
                  <p className="text-sm">
                    Verwerking van gegevens laten stoppen
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-stone-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">
                    📤 Recht op overdraagbaarheid
                  </h3>
                  <p className="text-sm">
                    Uw gegevens in leesbaar formaat ontvangen
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-stone-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">🚫 Recht van bezwaar</h3>
                  <p className="text-sm">Bezwaar maken tegen verwerking</p>
                </div>
              </div>

              <div className="bg-stone-100 dark:bg-stone-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">
                  📧 Uitoefening van rechten:
                </h3>
                <p>
                  Stuur een e-mail naar <strong>privacy@cocufum.com</strong>{" "}
                  met:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Uw volledige naam</li>
                  <li>E-mailadres gekoppeld aan uw account</li>
                  <li>Duidelijke omschrijving van uw verzoek</li>
                  <li>Kopie identiteitsbewijs (ID nummer afgedekt)</li>
                </ul>
                <p className="mt-2 text-sm">
                  Wij reageren binnen 30 dagen op uw verzoek.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              8. Beveiliging
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p>
                Wij nemen passende technische en organisatorische maatregelen om
                uw gegevens te beschermen:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  <strong>SSL-encryptie:</strong> Alle gegevensoverdracht is
                  versleuteld
                </li>
                <li>
                  <strong>Beveiligde servers:</strong> Gegevens worden
                  opgeslagen op beveiligde servers
                </li>
                <li>
                  <strong>Toegangscontrole:</strong> Beperkte toegang tot
                  persoonsgegevens
                </li>
                <li>
                  <strong>Regular updates:</strong> Systemen worden regelmatig
                  bijgewerkt
                </li>
                <li>
                  <strong>Backup procedures:</strong> Regelmatige veilige
                  back-ups
                </li>
                <li>
                  <strong>Incident response:</strong> Procedures bij datalekken
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              9. Internationale Overdrachten
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p>
                Sommige van onze leveranciers en dienstverleners bevinden zich
                buiten de EU:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  <strong>Dropshipping leveranciers:</strong> Mogelijk buiten EU
                  (met adequate waarborgen)
                </li>
                <li>
                  <strong>Cloud diensten:</strong> Google, AWS (met Privacy
                  Shield/adequaatheidsbesluiten)
                </li>
                <li>
                  <strong>Analytics:</strong> Google Analytics (met
                  gegevensverwerkingsovereenkomst)
                </li>
              </ul>
              <p>
                Alle internationale overdrachten vinden plaats met adequate
                waarborgen conform GDPR artikel 44-49.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              10. Wijzigingen Privacy Policy
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p>
                Wij kunnen deze privacy policy wijzigen om te voldoen aan nieuwe
                wetgeving of bij wijzigingen in onze dienstverlening.
              </p>
              <p>Belangrijke wijzigingen communiceren wij via:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>E-mail naar geregistreerde gebruikers</li>
                <li>Melding op onze website</li>
                <li>Update datum bovenaan dit document</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              11. Klachten en Contact
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <div className="bg-orange-50 dark:bg-stone-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">📞 Contact opnemen:</h3>
                <ul className="space-y-1">
                  <li>
                    <strong>Privacy vragen:</strong> privacy@cocufum.com
                  </li>
                  <li>
                    <strong>Algemeen:</strong> info@cocufum.com
                  </li>
                  <li>
                    <strong>Website:</strong> www.cocufum.com
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-stone-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">⚖️ Klacht indienen:</h3>
                <p>
                  Niet tevreden over onze gegevensverwerking? U kunt een klacht
                  indienen bij:
                </p>
                <p>
                  <strong>Autoriteit Persoonsgegevens</strong>
                  <br />
                  Website: autoriteitpersoonsgegevens.nl
                  <br />
                  Telefoon: 088 - 1805 250
                </p>
              </div>
            </div>
          </section>

          <section className="border-t pt-6">
            <div className="text-center text-stone-600 dark:text-stone-400">
              <p>
                Deze privacy policy is opgesteld conform de Algemene Verordening
                Gegevensbescherming (AVG/GDPR)
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
