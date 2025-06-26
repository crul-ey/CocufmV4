// In je components/ui/toaster.tsx bestand

"use client";

import { useToast } from "@/hooks/use-toast"; // Pas pad aan indien nodig
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToastProps } from "./toast"; // Importeer de props

// Verplaats de stijlvariabele buiten de component voor betere performance
const toastVariants = {
  default:
    "border-stone-200 bg-white text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100",
  destructive:
    "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
  success:
    "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
};

const progressBarVariants = {
  default: "bg-stone-500",
  destructive: "bg-red-500",
  success: "bg-green-500",
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    // --- VERBETERING: Toegankelijkheid toegevoegd ---
    <div
      className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-4 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
      role="region"
      aria-live="assertive"
      aria-label="Notificaties"
    >
      {toasts.map(function (toast) {
        const {
          id,
          title,
          description,
          variant = "default",
          onOpenChange,
          duration,
          ...props
        } = toast;
        const animationDuration = duration || 5000;

        return (
          <div
            key={id}
            className={`group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg transition-all duration-300 ease-in-out animate-in slide-in-from-top-full data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-top-full sm:slide-in-from-bottom-full sm:data-[state=closed]:slide-out-to-bottom-full ${toastVariants[variant]}`}
            data-state={toast.open ? "open" : "closed"}
            role="status" // of "alert" voor 'destructive' varianten
            aria-atomic="true"
            {...props}
          >
            <div className="grid gap-1 flex-1">
              {title && (
                <div className="text-sm font-semibold leading-none tracking-tight">
                  {title}
                </div>
              )}
              {description && (
                <div className="text-sm opacity-90 leading-relaxed">
                  {description}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 h-6 w-6 p-0 opacity-70 hover:opacity-100 transition-opacity"
              onClick={() => {
                dismiss(id);
                onOpenChange?.(false);
              }}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Close</span>
            </Button>

            {/* Progress bar gebruikt nu de dynamische duur */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-black/10 dark:bg-white/10">
              <div
                className={`h-full ${progressBarVariants[variant]}`}
                style={{
                  animation: `toast-progress ${animationDuration}ms linear forwards`,
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Zorg dat de keyframes in je global.css staan voor betere performance */}
      <style jsx>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
