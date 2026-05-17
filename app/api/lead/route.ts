import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadFormSchema, serviceLabels } from "@/lib/validations";

// Initialize Resend with API Key (if provided in environment variables)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const notificationEmail = process.env.NOTIFICATION_EMAIL || "contact@winagro.bj";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Server-side Zod Validation
    const validation = leadFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, phone, service, message } = validation.data;
    const serviceLabel = serviceLabels[service];

    console.log("🌱 Lead reçu :", { fullName, phone, service: serviceLabel, message });

    // 2. Send email notification via Resend if API Key is configured
    let emailSent = false;
    if (resend) {
      try {
        const emailResult = await resend.emails.send({
          from: "Win Agro Site <noreply@winagro.bj>",
          to: [notificationEmail],
          subject: `🌱 Nouveau lead Win Agro — ${serviceLabel} — ${fullName}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #4A4A4A; max-width: 600px; border: 1px solid #E6F4EC; border-radius: 8px; background-color: #FAFAF3;">
              <h2 style="color: #076B37; border-bottom: 2px solid #098947; padding-bottom: 10px;">Nouveau Contact Win Agro</h2>
              <p>Un visiteur a soumis une demande d'accompagnement ou une commande sur le site internet :</p>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr style="background-color: #E6F4EC;">
                  <th style="text-align: left; padding: 8px; border-bottom: 1px solid #C8E4D0; color: #076B37;">Champ</th>
                  <th style="text-align: left; padding: 8px; border-bottom: 1px solid #C8E4D0; color: #076B37;">Valeur</th>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Nom complet</td>
                  <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">WhatsApp / Tél</td>
                  <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">
                    <a href="tel:${phone}" style="color: #098947; font-weight: bold; text-decoration: none;">${phone}</a>
                    | 
                    <a href="https://wa.me/${phone.replace(/[^0-9]/g, "")}" style="color: #098947; font-weight: bold; text-decoration: none;">Discuter sur WhatsApp</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Intérêt</td>
                  <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; color: #076B37; font-weight: bold;">${serviceLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Message</td>
                  <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-style: italic;">${message || "Aucun message fourni"}</td>
                </tr>
              </table>
              
              <div style="margin-top: 30px; padding: 15px; background-color: #FFFBE0; border-left: 4px solid #FDDD00; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #C8A800; font-weight: bold;">Action recommandée :</p>
                <p style="margin: 5px 0 0 0; font-size: 14px;">Recontacte ce lead sous 24h par appel direct ou WhatsApp. C'est le secret pour convertir à coup sûr ! 🌱</p>
              </div>
              
              <footer style="margin-top: 40px; font-size: 12px; color: #7A7A7A; text-align: center; border-top: 1px solid #E6F4EC; padding-top: 15px;">
                © 2025 Win Agro Agri Tech Solutions. Tous droits réservés.
              </footer>
            </div>
          `,
        });
        emailSent = !!emailResult.data;
      } catch (emailError) {
        console.error("❌ Erreur lors de l'envoi de l'email via Resend :", emailError);
      }
    } else {
      console.warn("⚠️ Resend API Key non configurée. Email de notification ignoré (mode dev).");
    }

    // 3. Return success and variables for client-side WhatsApp redirection
    return NextResponse.json({
      success: true,
      message: "Reçu ✓ Victoire te contacte dans les 24h. 🌱",
      data: {
        fullName,
        phone,
        service: serviceLabel,
        rawService: service,
        messageContent: message || "",
        emailNotificationSent: emailSent,
      },
    });
  } catch (error) {
    console.error("❌ Erreur API Route `/api/lead` :", error);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur interne est survenue. Veuillez réessayer.",
      },
      { status: 500 }
    );
  }
}
