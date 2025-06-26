"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function OrderStatusPage() {
  const [orderStatusUrl, setOrderStatusUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [isValidUrl, setIsValidUrl] = useState(true);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Basic validation for Shopify order status URL pattern
    // Example: https://your-store.myshopify.com/1234567890/orders/abcdef1234567890abcdef1234567890?key=0987654321fedcba0987654321fedcba
    const shopifyOrderStatusPattern =
      /^https:\/\/[a-zA-Z0-9-]+\.myshopify\.com\/\d+\/orders\/[a-f0-9]+\?key=[a-f0-9]+$/;

    // Allow shop.domain.com/account/orders/ORDER_ID/TOKEN
    // Example: https://shop.yourdomain.com/account/orders/gid%3A%2F%2Fshopify%2FOrder%2F1234567890%3Fkey%3Dabcdef1234567890abcdef1234567890
    const customDomainOrderStatusPattern =
      /^https:\/\/shop\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\/account\/orders\/[a-zA-Z0-9%]+\?key=[a-f0-9]+$/;

    if (
      shopifyOrderStatusPattern.test(orderStatusUrl) ||
      customDomainOrderStatusPattern.test(orderStatusUrl)
    ) {
      setSubmittedUrl(orderStatusUrl);
      setIsValidUrl(true);
    } else {
      setSubmittedUrl(null);
      setIsValidUrl(false);
    }
  };

  return (
    <div className="container py-8 md:py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold">
            Bestelstatus Controleren
          </CardTitle>
          <CardDescription>
            Bekijk de status van je bestelling bij Cocúfum.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Hoe vind je je bestelstatus?
            </h3>
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              Na het plaatsen van je bestelling heb je een
              **bestelbevestigingsmail** van ons ontvangen. In deze e-mail vind
              je een knop of link met de tekst "Bekijk je bestelling" of "Volg
              je bestelling". Als je hierop klikt, word je direct naar je
              persoonlijke bestelstatuspagina op de Shopify website geleid. Deze
              pagina bevat de meest actuele informatie over de verwerking en
              verzending van je pakket.
            </p>
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed mt-2">
              Je kunt de volledige URL van die bestelstatuspagina hieronder
              plakken om deze direct op onze site te bekijken.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="orderStatusUrl"
                className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1"
              >
                Shopify Bestelstatus URL
              </label>
              <Input
                type="url"
                id="orderStatusUrl"
                name="orderStatusUrl"
                value={orderStatusUrl}
                onChange={(e) => {
                  setOrderStatusUrl(e.target.value);
                  setIsValidUrl(true); // Reset validation on change
                  setSubmittedUrl(null); // Clear previous iframe on new input
                }}
                placeholder="Plak hier de volledige URL van je bestelstatuspagina"
                className={
                  !isValidUrl
                    ? "border-red-500 dark:border-red-600 focus-visible:ring-red-500"
                    : ""
                }
                required
              />
              {!isValidUrl && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Dit lijkt geen geldige Shopify bestelstatus URL. Controleer de
                  link uit je e-mail.
                </p>
              )}
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              Status Bekijken
            </Button>
          </form>

          {submittedUrl && isValidUrl && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Je Bestelstatus:</h3>
              <div className="aspect-[9/16] md:aspect-video w-full bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={submittedUrl}
                  title="Shopify Bestelstatus"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms" // Security sandbox
                />
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 text-center">
                Problemen met het laden?{" "}
                <Link
                  href={submittedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Open in nieuw tabblad{" "}
                  <ExternalLink className="inline w-3 h-3 ml-1" />
                </Link>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Lukt het niet om je status te vinden of heb je andere vragen? Neem
            dan contact op met onze{" "}
            <Link
              href="/contact"
              className="underline hover:text-blue-600 dark:hover:text-blue-400"
            >
              klantenservice
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
