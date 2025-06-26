"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";
import { FeedbackModal } from "./feedback-modal";

export function FeedbackTrigger() {
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [hasBeenShownAutomatically, setHasBeenShownAutomatically] =
    useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Automatische trigger na 15 seconden
  useEffect(() => {
    if (!isMounted || hasBeenShownAutomatically || open) {
      return;
    }

    const timer = setTimeout(() => {
      // Alleen openen als de modal nog niet handmatig is geopend
      // en nog niet automatisch is getoond in deze sessie.
      if (!open && !localStorage.getItem("feedbackModalShown")) {
        console.log("Feedback modal wordt automatisch getoond na 15 seconden.");
        setOpen(true);
        setHasBeenShownAutomatically(true);
        // Optioneel: markeer dat het is getoond om herhaling te voorkomen
        // localStorage.setItem("feedbackModalShown", "true");
        // sessionStorage.setItem("feedbackModalShownThisSession", "true");
      }
    }, 15000); // 15 seconden

    return () => clearTimeout(timer);
  }, [isMounted, hasBeenShownAutomatically, open]);

  // Functie om de modal te openen en te markeren als handmatig geopend
  const handleManualOpen = () => {
    setOpen(true);
    // Als je wilt dat handmatig openen ook telt als 'getoond', uncomment de volgende regel:
    // setHasBeenShownAutomatically(true);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleManualOpen}
        className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
        aria-label="Geef feedback"
      >
        <MessageSquareText className="h-6 w-6" />
      </Button>
      <FeedbackModal open={open} onOpenChangeAction={setOpen} />
    </>
  );
}
