"use client";

import type React from "react";
import { useState } from "react";
import {
  Mail,
  Send,
  Clock,
  Shield,
  Heart,
  Sparkles,
  CheckCircle,
  MessageCircle,
  Star,
} from "lucide-react";
import Header from "@/components/header";
import CartDrawer from "@/components/cart-drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type FormState = "idle" | "submitting" | "success" | "error";

export default function PremiumContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formState, setFormState] = useState<FormState>("idle");
  const [celebrationMode, setCelebrationMode] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormState("success");
        setCelebrationMode(true);

        toast({
          title: "🎉 Bericht succesvol verzonden!",
          description:
            "Bedankt voor je bericht. We nemen binnen 24 uur contact met je op.",
          variant: "success",
          duration: 5000,
        });

        setFormData({ name: "", email: "", subject: "", message: "" });

        setTimeout(() => {
          setCelebrationMode(false);
          setFormState("idle");
        }, 3000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      setFormState("error");
      toast({
        title: "❌ Er ging iets mis",
        description:
          "Je bericht kon niet worden verzonden. Probeer het opnieuw of neem direct contact op.",
        variant: "destructive",
        duration: 5000,
      });
      setTimeout(() => setFormState("idle"), 3000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Header />
      <CartDrawer />

      <main className="pt-20 lg:pt-24 pb-12">
        <div className="container">
          {/* Premium Hero Section */}
          <div className="relative text-center mb-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-3xl -z-10" />
            <div className="absolute top-4 right-4">
              <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
            </div>
            <div className="absolute bottom-4 left-4">
              <Heart className="w-6 h-6 text-red-500 animate-pulse" />
            </div>

            <div className="relative z-10 py-16 px-8">
              <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2">
                <MessageCircle className="w-4 h-4 mr-2" />
                Premium Support
              </Badge>

              <h1 className="font-serif text-4xl lg:text-5xl font-bold bg-gradient-to-r from-stone-900 via-blue-800 to-purple-800 dark:from-stone-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6">
                Laten we in contact komen! ✨
              </h1>

              <p className="text-xl text-stone-600 dark:text-stone-400 max-w-3xl mx-auto leading-relaxed">
                Heb je een vraag over onze premium collectie? Wil je advies over
                het perfecte cadeau? Of gewoon een compliment delen? We horen
                graag van je!
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Premium Contact Form */}
              <div
                className={`relative bg-white dark:bg-stone-900 rounded-3xl p-8 lg:p-10 shadow-xl border border-stone-200 dark:border-stone-700 transition-all duration-500 ${
                  celebrationMode
                    ? "ring-4 ring-green-400 bg-green-50 dark:bg-green-900/20"
                    : ""
                }`}
              >
                {celebrationMode && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 rounded-3xl animate-pulse" />
                )}

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Send className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                        Stuur ons een bericht
                      </h2>
                      <p className="text-stone-600 dark:text-stone-400">
                        We reageren binnen 24 uur
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3"
                        >
                          Naam *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          disabled={formState === "submitting"}
                          className="w-full px-4 py-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl 
                                   focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Je volledige naam"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3"
                        >
                          E-mailadres *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={formState === "submitting"}
                          className="w-full px-4 py-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl 
                                   focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="je@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3"
                      >
                        Onderwerp *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={formState === "submitting"}
                        className="w-full px-4 py-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl 
                                 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Selecteer een onderwerp</option>
                        <option value="algemeen">💬 Algemene vraag</option>
                        <option value="bestelling">
                          📦 Vraag over bestelling
                        </option>
                        <option value="product">🏖️ Productvraag</option>
                        <option value="retour">🔄 Retour/ruil</option>
                        <option value="klacht">⚠️ Klacht</option>
                        <option value="compliment">⭐ Compliment</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3"
                      >
                        Bericht *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        disabled={formState === "submitting"}
                        className="w-full px-4 py-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl 
                                 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-vertical
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Vertel ons wat je op je hart hebt..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={formState === "submitting"}
                      className={`w-full py-4 text-lg font-bold rounded-xl transition-all duration-500 transform hover:scale-[1.02] shadow-lg hover:shadow-xl
                        ${formState === "submitting" && "cursor-wait"}
                        ${
                          formState === "success" &&
                          "bg-green-600 hover:bg-green-600"
                        }
                        ${
                          formState === "error" && "bg-red-600 hover:bg-red-600"
                        }
                        ${
                          formState === "idle" &&
                          "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white"
                        }
                      `}
                    >
                      {formState === "submitting" && (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                          Verzenden...
                        </>
                      )}
                      {formState === "success" && (
                        <>
                          <CheckCircle className="w-5 h-5 mr-3" />
                          Verzonden! ✨
                        </>
                      )}
                      {formState === "error" && (
                        <>
                          <Send className="w-5 h-5 mr-3" />
                          Opnieuw proberen
                        </>
                      )}
                      {formState === "idle" && (
                        <>
                          <Send className="w-5 h-5 mr-3" />
                          Bericht Verzenden
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Premium Contact Info */}
              <div className="space-y-8">
                {/* Contact Details Card */}
                <div className="bg-gradient-to-br from-white via-stone-50 to-stone-100 dark:from-stone-900 dark:via-stone-800 dark:to-stone-700 rounded-3xl p-8 shadow-xl border border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                      Contactgegevens
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-1">
                          E-mail
                        </h3>
                        <p className="text-blue-600 font-medium">
                          info@cocufum.com
                        </p>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                          ⚡ We reageren binnen 24 uur
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Service Badges */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 border border-blue-200 dark:border-blue-700">
                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-6 text-center">
                    🌟 Premium Service Garantie
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white dark:bg-stone-800 rounded-2xl">
                      <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                        24u Response
                      </div>
                      <div className="text-xs text-stone-500 dark:text-stone-400">
                        Snelle reactie
                      </div>
                    </div>

                    <div className="text-center p-4 bg-white dark:bg-stone-800 rounded-2xl">
                      <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                        100% Veilig
                      </div>
                      <div className="text-xs text-stone-500 dark:text-stone-400">
                        Privacy gegarandeerd
                      </div>
                    </div>

                    <div className="text-center p-4 bg-white dark:bg-stone-800 rounded-2xl">
                      <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                        5-Sterren Service
                      </div>
                      <div className="text-xs text-stone-500 dark:text-stone-400">
                        Premium support
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 shadow-xl border border-stone-200 dark:border-stone-700">
                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-6">
                    💡 Veelgestelde Vragen
                  </h3>

                  <div className="space-y-4">
                    <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl">
                      <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">
                        🚚 Hoe lang duurt de verzending?
                      </h4>
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        Standaard verzending binnen Nederland duurt 2-3
                        werkdagen. Gratis vanaf €75!
                      </p>
                    </div>

                    <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl">
                      <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">
                        🔄 Kan ik mijn bestelling retourneren?
                      </h4>
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        Ja, je hebt 14 dagen retourrecht op alle producten.
                        Retourneren is altijd gratis!
                      </p>
                    </div>

                    <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl">
                      <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">
                        🌱 Zijn jullie producten duurzaam?
                      </h4>
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        Absoluut! We selecteren alleen producten van duurzame
                        materialen en leveranciers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
