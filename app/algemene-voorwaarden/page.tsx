import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Algemene Voorwaarden",
  description:
    "Algemene voorwaarden van Cocúfum voor online aankopen en dropshipping services.",
};

export default function AlgemeneVoorwaardenPage() {
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
            Algemene Voorwaarden
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Laatst bijgewerkt: {new Date().toLocaleDateString("nl-NL")}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-lg shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              1. Definities
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p>
                <strong>Verkoper:</strong> crul.dev, ingeschreven bij de Kamer
                van Koophandel onder handelsnaam Cocúfum
              </p>
              <p>
                <strong>Koper:</strong> De natuurlijke of rechtspersoon die een
                overeenkomst aangaat met verkoper
              </p>
              <p>
                <strong>Dropshipping:</strong> Verkoopmethode waarbij verkoper
                als tussenpersoon optreedt tussen koper en leverancier
              </p>
              <p>
                <strong>Leverancier:</strong> Derde partij die producten direct
                aan koper verzendt namens verkoper
              </p>
              <p>
                <strong>Website:</strong> De online winkel bereikbaar via
                cocufum.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              2. Toepasselijkheid
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p>
                Deze algemene voorwaarden zijn van toepassing op alle
                aanbiedingen, overeenkomsten en leveringen van verkoper.
              </p>
              <p>
                Door het plaatsen van een bestelling gaat koper akkoord met deze
                voorwaarden.
              </p>
              <p>
                Afwijkingen zijn alleen geldig indien schriftelijk
                overeengekomen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              3. Dropshipping Model
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p>
                <strong>BELANGRIJK:</strong> Verkoper opereert volgens een
                dropshipping model en treedt op als tussenpersoon.
              </p>
              <p>Dit betekent dat:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  Producten worden direct door leveranciers aan koper verzonden
                </li>
                <li>Verkoper heeft geen fysieke voorraad in bezit</li>
                <li>
                  Leveringstijden afhankelijk zijn van externe leveranciers
                </li>
                <li>Kwaliteit en verpakking door leveranciers wordt bepaald</li>
                <li>
                  Verkoper faciliteert de transactie tussen koper en leverancier
                </li>
              </ul>
              <p>
                Door bestelling te plaatsen, gaat koper uitdrukkelijk akkoord
                met dit dropshipping model.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              4. Prijzen en Betaling
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p>
                Alle prijzen zijn inclusief BTW en exclusief verzendkosten,
                tenzij anders vermeld.
              </p>
              <p>
                Verzendkosten bedragen €7,90 voor het eerste product en €1,00
                voor elk volgend product.
              </p>
              <p>
                Gratis verzending vanaf €75,00 bestellwaarde binnen Nederland.
              </p>
              <p>
                Betaling dient vooraf te geschieden via de beschikbare
                betaalmethoden.
              </p>
              <p>Bij niet-betaling vervalt de bestelling automatisch.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              5. Levering
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p>
                <strong>Leveringstijd:</strong> 7-21 werkdagen na bevestiging
                betaling
              </p>
              <p>Leveringstijden zijn indicatief en afhankelijk van:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Beschikbaarheid bij leverancier</li>
                <li>Internationale verzending en douaneafhandeling</li>
                <li>Weersomstandigheden en force majeure</li>
                <li>Drukte bij verzendpartners</li>
              </ul>
              <p>
                Verkoper is niet aansprakelijk voor vertragingen buiten haar
                controle.
              </p>
              <p>Levering geschiedt op het door koper opgegeven adres.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              6. Herroepingsrecht (14 dagen)
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p>
                Koper heeft het recht de overeenkomst binnen 14 dagen zonder
                opgave van redenen te herroepen.
              </p>
              <p>
                De herroepingstermijn begint op de dag waarop koper het product
                in bezit krijgt.
              </p>
              <p>
                <strong>Procedure:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Stuur een e-mail naar info@cocufum.com</li>
                <li>Vermeld bestelnummer en reden van retour</li>
                <li>Wacht op retourinstructies</li>
                <li>Verzend product in originele staat en verpakking</li>
              </ul>
              <p>
                <strong>Kosten:</strong> Retourverzendkosten zijn voor rekening
                van koper.
              </p>
              <p>
                <strong>Terugbetaling:</strong> Binnen 14 dagen na ontvangst
                retour, exclusief oorspronkelijke verzendkosten.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              7. Garantie en Aansprakelijkheid
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p>
                <strong>Beperkte aansprakelijkheid:</strong> Verkoper's
                aansprakelijkheid is beperkt tot het bedrag van de betreffende
                bestelling.
              </p>
              <p>Verkoper is niet aansprakelijk voor:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Indirecte schade of gevolgschade</li>
                <li>
                  Kwaliteit van producten (verantwoordelijkheid leverancier)
                </li>
                <li>Vertragingen door leveranciers of verzendpartners</li>
                <li>Douanekosten of importbelastingen</li>
                <li>Schade door onjuist gebruik van producten</li>
              </ul>
              <p>
                Wettelijke garantie blijft onverminderd van kracht conform
                Nederlandse wetgeving.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              8. Klachten en Geschillen
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p>
                Klachten kunnen worden ingediend via info@cocufum.com binnen 30
                dagen na levering.
              </p>
              <p>Verkoper streeft naar oplossing binnen 14 werkdagen.</p>
              <p>Bij geschillen is Nederlands recht van toepassing.</p>
              <p>
                Geschillen worden voorgelegd aan de bevoegde rechter in
                Nederland.
              </p>
              <p>
                Consumenten kunnen zich wenden tot de Geschillencommissie
                Thuiswinkel.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              9. Privacy en Gegevensverwerking
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p>
                Verkoper verwerkt persoonsgegevens conform de Privacy Policy.
              </p>
              <p>
                Voor dropshipping worden noodzakelijke gegevens gedeeld met
                leveranciers.
              </p>
              <p>
                Koper heeft recht op inzage, rectificatie en verwijdering van
                gegevens.
              </p>
              <p>
                Zie onze volledige{" "}
                <Link
                  href="/privacy-policy"
                  className="text-orange-600 hover:underline"
                >
                  Privacy Policy
                </Link>{" "}
                voor details.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              10. Wijzigingen
            </h2>
            <div className="space-y-3 text-stone-700 dark:text-stone-300">
              <p>
                Verkoper behoudt zich het recht voor deze voorwaarden te
                wijzigen.
              </p>
              <p>Wijzigingen worden gepubliceerd op de website.</p>
              <p>
                Voor lopende overeenkomsten gelden de voorwaarden zoals die
                golden bij het sluiten van de overeenkomst.
              </p>
            </div>
          </section>

          <section className="border-t pt-6">
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
              Contactgegevens
            </h2>
            <div className="space-y-2 text-stone-700 dark:text-stone-300">
              <p>
                <strong>Bedrijfsnaam:</strong> crul.dev (handelsnaam: Cocúfum)
              </p>
              <p>
                <strong>E-mail:</strong> info@cocufum.com
              </p>
              <p>
                <strong>Website:</strong> www.cocufum.com
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
