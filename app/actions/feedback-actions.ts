"use server"

import { z } from "zod"
import nodemailer from "nodemailer"

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
    _form?: string[] // For general form errors
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

  // Configure Nodemailer transporter
  // Ensure your environment variables are set in Vercel
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT), // SMTP_PORT is usually a string from env
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465 (SSL), false for other ports (e.g., 587 for TLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Mijndomein might require specific TLS options if port 587 is used
    // tls: {
    //   ciphers:'SSLv3' // Example, check Mijndomein's specific requirements if not using port 465
    // }
  })

  // Construct email message
  const mailSubject = "Nieuwe Feedback Ontvangen via Cocufum Website!"
  const mailHtmlBody = `
    <h1>Nieuwe Feedback</h1>
    <p>Je hebt nieuwe feedback ontvangen via de Cocúfum website:</p>
    <hr>
    <h2>Gewenste nieuwe producten/categorieën:</h2>
    <p>${newProducts}</p>
    ${experienceRating ? `<h2>Ervaring rating:</h2><p>${experienceRating} / 5 sterren</p>` : ""}
    ${suggestions ? `<h2>Suggesties/opmerkingen:</h2><p>${suggestions.replace(/\n/g, "<br>")}</p>` : ""}
    ${email ? `<h2>E-mailadres indiener (optioneel):</h2><p><a href="mailto:${email}">${email}</a></p>` : ""}
    <hr>
    <p>Dit is een automatisch gegenereerde e-mail.</p>
  `

  const mailOptions = {
    from: `"Cocúfum Feedback Formulier" <${process.env.SMTP_USER}>`, // Sender address (can be the same as SMTP_USER)
    to: process.env.SMTP_USER, // Receiver address (your info@cocufum.com)
    subject: mailSubject,
    html: mailHtmlBody,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Feedback email sent successfully to:", process.env.SMTP_USER)
    return {
      message: "Bedankt voor je feedback! We hebben het ontvangen en waarderen je input.",
      success: true,
    }
  } catch (error) {
    console.error("Error sending feedback email:", error)
    // Provide a more generic error to the user for security
    return {
      message:
        "Er is een fout opgetreden bij het versturen van je feedback. Probeer het later opnieuw of neem direct contact met ons op.",
      success: false,
      errors: { _form: ["Kon de feedback e-mail niet versturen. Controleer de server logs voor details."] },
    }
  }
}
