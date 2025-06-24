"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";
import { FeedbackModal } from "./feedback-modal";

export function FeedbackTrigger() {
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);

  // Ensure component is mounted on the client before rendering,
  // to avoid hydration mismatches with modals.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 z-50 animate-fade-in-up"
        aria-label="Geef feedback"
      >
        <MessageSquareText className="h-6 w-6" />
      </Button>
      <FeedbackModal open={open} onOpenChangeAction={setOpen} />
    </>
  );
}
