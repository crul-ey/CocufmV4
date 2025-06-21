import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Alle velden zijn verplicht" }, { status: 400 })
    }

    // Create transporter (configure based on your email provider)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email to your business
    const businessEmail = {
      from: process.env.SMTP_USER,
      to: "info@cocufum.com",
      subject: `🌟 Nieuw Contact Formulier: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px;">
          <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0; font-size: 28px;">✨ Nieuw Contact Bericht</h1>
              <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #667eea, #764ba2); margin: 15px auto; border-radius: 2px;"></div>
            </div>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 20px;">
              <h2 style="color: #495057; margin: 0 0 20px 0; font-size: 20px;">📋 Contact Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6c757d; font-weight: bold; width: 100px;">👤 Naam:</td>
                  <td style="padding: 8px 0; color: #333;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6c757d; font-weight: bold;">📧 Email:</td>
                  <td style="padding: 8px 0; color: #333;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6c757d; font-weight: bold;">📝 Onderwerp:</td>
                  <td style="padding: 8px 0; color: #333;">${subject}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6c757d; font-weight: bold;">⏰ Tijd:</td>
                  <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString("nl-NL")}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #e3f2fd; padding: 25px; border-radius: 12px; border-left: 5px solid #2196f3;">
              <h3 style="color: #1976d2; margin: 0 0 15px 0; font-size: 18px;">💬 Bericht:</h3>
              <p style="color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef;">
              <p style="color: #6c757d; margin: 0; font-size: 14px;">
                🌟 Verzonden via Cocúfum Contact Formulier<br>
                <strong>Reageer binnen 24 uur voor premium service!</strong>
              </p>
            </div>
          </div>
        </div>
      `,
    }

    // Auto-reply email to customer
    const customerEmail = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "✨ Bedankt voor je bericht - Cocúfum",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px;">
          <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0; font-size: 28px;">🌟 Bedankt ${name}!</h1>
              <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #667eea, #764ba2); margin: 15px auto; border-radius: 2px;"></div>
            </div>
            
            <div style="background: #e8f5e8; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #4caf50;">
              <h2 style="color: #2e7d32; margin: 0 0 15px 0; font-size: 20px;">✅ Je bericht is ontvangen!</h2>
              <p style="color: #333; line-height: 1.6; margin: 0;">
                We hebben je bericht over "<strong>${subject}</strong>" ontvangen en zullen binnen 24 uur reageren. 
                Ons team bekijkt je vraag met de grootste zorg.
              </p>
            </div>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
              <h3 style="color: #495057; margin: 0 0 20px 0; font-size: 18px;">🎯 Wat gebeurt er nu?</h3>
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="width: 30px; height: 30px; background: #2196f3; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; color: white; font-weight: bold;">1</div>
                <p style="margin: 0; color: #333;">We bekijken je bericht binnen 2 uur</p>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="width: 30px; height: 30px; background: #ff9800; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; color: white; font-weight: bold;">2</div>
                <p style="margin: 0; color: #333;">Ons team bereidt een persoonlijk antwoord voor</p>
              </div>
              <div style="display: flex; align-items: center;">
                <div style="width: 30px; height: 30px; background: #4caf50; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; color: white; font-weight: bold;">3</div>
                <p style="margin: 0; color: #333;">Je ontvangt binnen 24 uur ons antwoord</p>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 12px; text-align: center;">
              <h3 style="color: white; margin: 0 0 15px 0; font-size: 18px;">🏖️ Ontdek onze Zomer Collectie</h3>
              <p style="color: rgba(255,255,255,0.9); margin: 0 0 20px 0; line-height: 1.6;">
                Terwijl je wacht, bekijk onze nieuwste premium strandhanddoeken en zomer accessoires!
              </p>
              <a href="https://cocufum.com/shop" style="display: inline-block; background: white; color: #667eea; padding: 12px 25px; border-radius: 25px; text-decoration: none; font-weight: bold; transition: transform 0.2s;">
                🛍️ Bekijk Collectie
              </a>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef;">
              <p style="color: #6c757d; margin: 0 0 10px 0; font-size: 14px;">
                📧 <strong>info@cocufum.com</strong> |
              </p>
              <p style="color: #6c757d; margin: 0; font-size: 12px;">
                Met vriendelijke groet,<br>
                <strong>Het Cocúfum Team</strong> 🌟
              </p>
            </div>
          </div>
        </div>
      `,
    }

    // Send both emails
    await transporter.sendMail(businessEmail)
    await transporter.sendMail(customerEmail)

    return NextResponse.json({
      success: true,
      message: "Bericht succesvol verzonden!",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Er ging iets mis bij het verzenden van je bericht" }, { status: 500 })
  }
}
