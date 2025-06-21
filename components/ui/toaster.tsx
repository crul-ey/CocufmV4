"use client";

import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map(
        ({ id, title, description, variant, onOpenChange, ...props }) => (
          <div
            key={id}
            className={`group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg transition-all duration-300 ease-in-out animate-in slide-in-from-top-full sm:slide-in-from-bottom-full ${
              variant === "destructive"
                ? "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100"
                : variant === "success"
                ? "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100"
                : "border-stone-200 bg-white text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            }`}
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

            {/* 🎯 PREMIUM: Close button met hover effect */}
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

            {/* 🎨 PREMIUM: Progress bar voor auto-dismiss */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-black/10 dark:bg-white/10">
              <div
                className={`h-full transition-all duration-[5000ms] ease-linear ${
                  variant === "destructive"
                    ? "bg-red-500"
                    : variant === "success"
                    ? "bg-green-500"
                    : "bg-stone-500"
                }`}
                style={{
                  animation: "toast-progress 5s linear forwards",
                }}
              />
            </div>
          </div>
        )
      )}

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
