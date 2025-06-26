"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Star,
  MessageSquareText,
  Lightbulb,
  Send,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  submitFeedback,
  type FeedbackFormState,
} from "@/app/actions/feedback-actions";

interface FeedbackModalProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

const initialState: FeedbackFormState = {
  message: "",
  success: false,
};

export function FeedbackModal({
  open,
  onOpenChangeAction,
}: FeedbackModalProps) {
  const [state, formAction, isPending] = useActionState(
    submitFeedback,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      // Reset form fields after successful submission
      formRef.current?.reset();
      // Optionally close the modal after a delay
      const timer = setTimeout(() => {
        onOpenChangeAction(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.success, onOpenChangeAction]);

  const StarRating = ({
    name,
    disabled,
  }: {
    name: string;
    disabled?: boolean;
  }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const [currentRating, setCurrentRating] = useState(0);

    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <label key={star} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={star}
              className="sr-only"
              onChange={() => setCurrentRating(star)}
              disabled={disabled}
              required={false} // Making it optional
            />
            <Star
              className={`w-7 h-7 transition-colors ${
                hoverRating >= star || currentRating >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-stone-300 dark:text-stone-600"
              }`}
              onMouseEnter={() => !disabled && setHoverRating(star)}
              onMouseLeave={() => !disabled && setHoverRating(0)}
            />
          </label>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 shadow-2xl rounded-xl">
        <DialogHeader className="pt-2">
          <DialogTitle className="text-2xl font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <MessageSquareText className="w-6 h-6 text-blue-500" />
            Deel je mening!
          </DialogTitle>
          <DialogDescription className="text-stone-600 dark:text-stone-400">
            Jouw feedback helpt ons Cocúfum nog beter te maken.
          </DialogDescription>
        </DialogHeader>

        {state.message && !state.success && (
          <div
            className={`p-3 rounded-md text-sm flex items-start gap-2 mt-2 ${
              state.success
                ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700"
                : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700"
            }`}
          >
            {state.success ? (
              <CheckCircle className="w-5 h-5 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 mt-0.5" />
            )}
            <div>
              <p className="font-medium">
                {state.success ? "Gelukt!" : "Oeps!"}
              </p>
              <p>{state.message}</p>
            </div>
          </div>
        )}

        {state.success ? (
          <div className="py-8 text-center flex flex-col items-center gap-4">
            <CheckCircle className="w-16 h-16 text-green-500 animate-pulse" />
            <p className="text-lg font-medium text-stone-700 dark:text-stone-200">
              {state.message}
            </p>
          </div>
        ) : (
          <form action={formAction} ref={formRef} className="space-y-6 py-2">
            <div>
              <Label
                htmlFor="newProducts"
                className="text-sm font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1.5 mb-1.5"
              >
                <Lightbulb className="w-4 h-4 text-orange-500" />
                Welke nieuwe producten of categorieën zou je graag zien?
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="newProducts"
                name="newProducts"
                rows={3}
                placeholder="Bijv. 'duurzame zwemkleding', 'strandspelletjes voor kinderen', 'luxe zonnebrillen'..."
                className="bg-stone-50 dark:bg-stone-800 border-stone-300 dark:border-stone-600 focus:ring-blue-500 focus:border-blue-500"
                disabled={isPending}
              />
              {state.errors?.newProducts && (
                <p className="text-xs text-red-500 mt-1">
                  {state.errors.newProducts[0]}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="experienceRating"
                className="text-sm font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1.5 mb-2"
              >
                <Star className="w-4 h-4 text-yellow-500" />
                Hoe beoordeel je je algehele ervaring? (Optioneel)
              </Label>
              <StarRating name="experienceRating" disabled={isPending} />
              {state.errors?.experienceRating && (
                <p className="text-xs text-red-500 mt-1">
                  {state.errors.experienceRating[0]}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="suggestions"
                className="text-sm font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1.5 mb-1.5"
              >
                <MessageSquareText className="w-4 h-4 text-green-500" />
                Andere suggesties of opmerkingen? (Optioneel)
              </Label>
              <Textarea
                id="suggestions"
                name="suggestions"
                rows={3}
                placeholder="Bijv. 'de zoekfunctie kan beter', 'meer betaalopties', 'ik mis product X'..."
                className="bg-stone-50 dark:bg-stone-800 border-stone-300 dark:border-stone-600 focus:ring-blue-500 focus:border-blue-500"
                disabled={isPending}
              />
              {state.errors?.suggestions && (
                <p className="text-xs text-red-500 mt-1">
                  {state.errors.suggestions[0]}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-stone-700 dark:text-stone-300"
              >
                Je e-mailadres (optioneel, voor een reactie)
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jouwemail@voorbeeld.nl"
                className="bg-stone-50 dark:bg-stone-800 border-stone-300 dark:border-stone-600 focus:ring-blue-500 focus:border-blue-500"
                disabled={isPending}
              />
              {state.errors?.email && (
                <p className="text-xs text-red-500 mt-1">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  type="button"
                  disabled={isPending}
                  className="text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                >
                  Annuleren
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
              >
                {isPending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Versturen
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
