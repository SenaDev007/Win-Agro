import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadFormSchema, serviceLabels } from "@/lib/validations";
import { localStore } from "@/lib/db";

// Initialize Resend with API Key (if provided in environment variables)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const notificationEmail = process.env.NOTIFICATION_EMAIL || "contact@winagrotech.com";

function sanitize(str: any): string {
  if (typeof str !== "string") return "";
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Differentiate between old homepage form and new modal form
    const isModalForm = body && typeof body === "object" && "type" in body;

    if (isModalForm) {
      const { type, prenom, nom, whatsapp, ville } = body;
      const cleanType = sanitize(type);
      const cleanPrenom = sanitize(prenom);
      const cleanNom = sanitize(nom);
      const cleanWhatsapp = sanitize(whatsapp);
      const cleanVille = sanitize(ville);

      if (!cleanType || !cleanPrenom || !cleanNom || !cleanWhatsapp || !cleanVille) {
        return NextResponse.json({ success: false, message: "Informations requises manquantes" }, { status: 400 });
      }

      // Fetch dynamic form configuration
      const config = localStore.getFormConfigs().find(f => f.key === cleanType);
      if (!config) {
        return NextResponse.json({ success: false, message: "Formulaire inconnu" }, { status: 400 });
      }

      // Dynamically validate and extract extra fields from the config definition
      const detailsObj: Record<string, string> = {};
      for (const field of config.fields) {
        const val = body[field.name];
        if (field.required && !val) {
          return NextResponse.json({ success: false, message: `Le champ "${field.label}" est obligatoire.` }, { status: 400 });
        }
        if (val !== undefined) {
          detailsObj[field.label] = sanitize(String(val));
        }
      }

      // Log lead to database
      const typeLabel = config.title;
      const newLead = localStore.addLead({
        name: `${cleanPrenom} ${cleanNom}`,
        phone: cleanWhatsapp,
        type: typeLabel,
        location: cleanVille,
        details: detailsObj
      });

      // Construct dynamic message copy
      let htmlDetails = "";
      let whatsappMessage = `Bonjour Victoire,
 
Je m'appelle ${cleanPrenom} ${cleanNom}. Je souhaite vous contacter au sujet de : ${config.title}.
 
Voici mes coordonnées :
- Localisation : ${cleanVille}
- WhatsApp : ${cleanWhatsapp}`;

      for (const [label, val] of Object.entries(detailsObj)) {
        htmlDetails += `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">${label}</td>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">${val}</td>
          </tr>
        `;
        whatsappMessage += `\n- ${label} : ${val}`;
      }

      const emailSubject = `🌱 ${config.title} — ${cleanPrenom} ${cleanNom}`;

      // Send email via Resend
      let emailSent = false;
      if (resend) {
        try {
          const emailResult = await resend.emails.send({
            from: "Win Agro Site <noreply@winagrotech.com>",
            to: [notificationEmail],
            subject: emailSubject,
            html: `
              <div style="font-family: sans-serif; padding: 20px; color: #4A4A4A; max-width: 600px; border: 1px solid #E6F4EC; border-radius: 8px; background-color: #FAFAF3;">
                <h2 style="color: #076B37; border-bottom: 2px solid #098947; padding-bottom: 10px;">Nouveau Prospect — ${typeLabel}</h2>
                <p>Un prospect a soumis le formulaire d'intérêt en ligne :</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                  <tr style="background-color: #E6F4EC;">
                    <th style="text-align: left; padding: 8px; border-bottom: 1px solid #C8E4D0; color: #076B37;">Champ</th>
                    <th style="text-align: left; padding: 8px; border-bottom: 1px solid #C8E4D0; color: #076B37;">Valeur</th>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Prénom & Nom</td>
                    <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">${cleanPrenom} ${cleanNom}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">WhatsApp / Tél</td>
                    <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">
                      <a href="tel:${cleanWhatsapp}" style="color: #098947; font-weight: bold; text-decoration: none;">${cleanWhatsapp}</a>
                      | 
                      <a href="https://wa.me/${cleanWhatsapp.replace(/[^0-9]/g, "")}" style="color: #098947; font-weight: bold; text-decoration: none;">Discuter sur WhatsApp</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Localisation / Ville</td>
                    <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">${cleanVille}</td>
                  </tr>
                  ${htmlDetails}
                </table>
                
                <div style="margin-top: 30px; padding: 15px; background-color: #FFFBE0; border-left: 4px solid #FDDD00; border-radius: 4px;">
                  <p style="margin: 0; font-size: 14px; color: #C8A800; font-weight: bold;">Action recommandée :</p>
                  <p style="margin: 5px 0 0 0; font-size: 14px;">Recontacte ce prospect sous 24h par appel direct ou WhatsApp. C'est le secret pour convertir à coup sûr ! 🌱</p>
                </div>
                
                <footer style="margin-top: 40px; font-size: 12px; color: #7A7A7A; text-align: center; border-top: 1px solid #E6F4EC; padding-top: 15px;">
                  © 2026 Win Agro Agri Tech Solutions. Tous droits réservés.
                </footer>
              </div>
            `,
          });
          emailSent = !!emailResult.data;
        } catch (emailError) {
          console.error("❌ Erreur lors de l'envoi de l'email via Resend :", emailError);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Victoire vous recontacte dans les 24h.",
        data: {
          prenom: cleanPrenom,
          nom: cleanNom,
          whatsapp: cleanWhatsapp,
          ville: cleanVille,
          type: cleanType,
          whatsappUrl: `https://wa.me/2290161336548?text=${encodeURIComponent(whatsappMessage)}`,
          emailNotificationSent: emailSent,
        },
      });
    }

    // 2. Server-side Validation for Old Homepage Form
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
    const cleanFullName = sanitize(fullName);
    const cleanPhone = sanitize(phone);
    const cleanMessage = sanitize(message || "");

    console.log("🌱 Lead reçu (Classique) :", { cleanFullName, cleanPhone, service: serviceLabel, cleanMessage });

    localStore.addLead({
      name: cleanFullName,
      phone: cleanPhone,
      type: "Contact Standard",
      location: "Non spécifiée",
      details: {
        "Service demandé": serviceLabel,
        "Message": cleanMessage || "Aucun message"
      }
    });

    let emailSent = false;
    if (resend) {
      try {
        const emailResult = await resend.emails.send({
          from: "Win Agro Site <noreply@winagrotech.com>",
          to: [notificationEmail],
          subject: `🌱 Nouveau lead Win Agro — ${serviceLabel} — ${cleanFullName}`,
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
                  <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">${cleanFullName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">WhatsApp / Tél</td>
                  <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">
                    <a href="tel:${cleanPhone}" style="color: #098947; font-weight: bold; text-decoration: none;">${cleanPhone}</a>
                    | 
                    <a href="https://wa.me/${cleanPhone.replace(/[^0-9]/g, "")}" style="color: #098947; font-weight: bold; text-decoration: none;">Discuter sur WhatsApp</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Intérêt</td>
                  <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; color: #076B37; font-weight: bold;">${serviceLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Message</td>
                  <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-style: italic;">${cleanMessage || "Aucun message fourni"}</td>
                </tr>
              </table>
              
              <div style="margin-top: 30px; padding: 15px; background-color: #FFFBE0; border-left: 4px solid #FDDD00; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #C8A800; font-weight: bold;">Action recommandée :</p>
                <p style="margin: 5px 0 0 0; font-size: 14px;">Recontacte ce lead sous 24h par appel direct ou WhatsApp. C'est le secret pour convertir à coup sûr ! 🌱</p>
              </div>
              
              <footer style="margin-top: 40px; font-size: 12px; color: #7A7A7A; text-align: center; border-top: 1px solid #E6F4EC; padding-top: 15px;">
                © 2026 Win Agro Agri Tech Solutions. Tous droits réservés.
              </footer>
            </div>
          `,
        });
        emailSent = !!emailResult.data;
      } catch (emailError) {
        console.error("❌ Erreur lors de l'envoi de l'email via Resend :", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Reçu ✓ Victoire te contacte dans les 24h.",
      data: {
        fullName: cleanFullName,
        phone: cleanPhone,
        service: serviceLabel,
        rawService: service,
        messageContent: cleanMessage || "",
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
