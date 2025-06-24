"use server"

import { z } from "zod"

const feedbackSchema = z.object({
  newProducts: z.string().min(1, "Dit veld is verplicht."),
  experienceRating: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)), // Convert empty string to undefined, then to number
    z.number().min(1).max(5).optional(),
  ),
  suggestions: z.string().optional(),
  email: z.string().email("Ongeldig e-mailadres.").optional().or(z.literal("")), // Allow empty string
})

export interface FeedbackFormState {
  message: string
  success: boolean
  errors?: {
    newProducts?: string[]
    experienceRating?: string[]
    suggestions?: string[]
    email?: string[]
    _form?: string[]
  }
}

export async function submitFeedback(prevState: FeedbackFormState, formData: FormData): Promise<FeedbackFormState> {
  console.log("Feedback form data received:", Object.fromEntries(formData))

  const validatedFields = feedbackSchema.safeParse({
    newProducts: formData.get("newProducts"),
    experienceRating: formData.get("experienceRating"),
    suggestions: formData.get("suggestions"),
    email: formData.get("email"),
  })

  if (!validatedFields.success) {
    console.error("Feedback validation errors:", validatedFields.error.flatten().fieldErrors)
    return {
      message: "Validatiefout. Controleer de ingevulde velden.",
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { newProducts, experienceRating, suggestions, email } = validatedFields.data

  // Hier kun je de feedback opslaan in een database, naar een API sturen, e-mailen, etc.
  // Voorbeeld: loggen naar de console
  console.log("Gevalideerde feedback ontvangen:")
  console.log("Nieuwe producten/categorieën:", newProducts)
  if (experienceRating) console.log("Ervaring rating:", experienceRating)
  if (suggestions) console.log("Suggesties:", suggestions)
  if (email) console.log("E-mail:", email)

  // Simuleer een succesvolle opslag
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    message: "Bedankt voor je feedback! We waarderen je input.",
    success: true,
  }
}
