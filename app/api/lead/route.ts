import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadFormSchema, serviceLabels } from "@/lib/validations";
import { localStore } from "@/lib/db";
import { prisma } from "@/lib/prisma";

// Initialize Resend with API Key (if provided in environment variables)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const notificationEmail = process.env.NOTIFICATION_EMAIL || "contact@winagrotech.com";

function sanitize(str: any): string {
  if (typeof str !== "string") return "";
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
}

function formatWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, "");
  if (!cleaned) return "";
  if (cleaned.startsWith("229")) {
    return cleaned;
  }
  if (cleaned.startsWith("00229")) {
    return cleaned.substring(2);
  }
  if (cleaned.startsWith("0")) {
    return "229" + cleaned;
  }
  if (cleaned.length === 10 || cleaned.length === 8) {
    return "229" + cleaned;
  }
  return cleaned;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Differentiate between old homepage form and new modal form
    const isModalForm = body && typeof body === "object" && "type" in body;

    if (isModalForm) {
      const { type, prenom, nom, whatsapp, ville, email } = body;
      const cleanType = sanitize(type);
      const cleanPrenom = sanitize(prenom);
      const cleanNom = sanitize(nom);
      const cleanWhatsapp = sanitize(whatsapp);
      const cleanVille = sanitize(ville);
      const cleanEmail = sanitize(email);

      if (!cleanType || !cleanPrenom || !cleanNom || !cleanWhatsapp || !cleanVille || !cleanEmail) {
        return NextResponse.json({ success: false, message: "Informations requises manquantes" }, { status: 400 });
      }

      // Fetch dynamic form configuration
      const configs = await localStore.getFormConfigs();
      const config = configs.find(f => f.key === cleanType);
      const isCatalogueOrder = cleanType.startsWith("Commande Catalogue");

      if (!config && !isCatalogueOrder) {
        return NextResponse.json({ success: false, message: "Formulaire inconnu" }, { status: 400 });
      }

      // Dynamically validate and extract extra fields from the config definition
      const detailsObj: Record<string, string> = {};
      
      if (isCatalogueOrder) {
        // Extract products from cart (which are passed as extra body parameters starting with e/n/a)
        const productIds = Object.keys(body).filter(k => k.startsWith("e") || k.startsWith("n") || k.startsWith("a"));
        if (productIds.length > 0) {
          const dbProducts = await prisma.product.findMany({
            where: { id: { in: productIds } }
          });
          let total = 0;
          dbProducts.forEach(p => {
            const qty = Number(body[p.id]);
            if (qty > 0) {
              const priceText = p.price ? `${qty} × ${p.price.toLocaleString("fr-FR")} FCFA = ${(p.price * qty).toLocaleString("fr-FR")} FCFA` : `${qty} × Sur devis`;
              detailsObj[p.name] = priceText;
              if (p.price) total += p.price * qty;
            }
          });
          detailsObj["Total estimé"] = `${total.toLocaleString("fr-FR")} FCFA`;
        }
      } else if (config) {
        for (const field of config.fields) {
          const val = body[field.name];
          if (field.required && !val) {
            return NextResponse.json({ success: false, message: `Le champ "${field.label}" est obligatoire.` }, { status: 400 });
          }
          if (val !== undefined) {
            detailsObj[field.label] = sanitize(String(val));
          }
        }
      }

      // Check if this session has a previously abandoned/partial lead
      let existingLead: any = null;
      if (body.sessionToken) {
        existingLead = await prisma.lead.findFirst({
          where: {
            sessionToken: body.sessionToken,
            status: "abandoned"
          },
          orderBy: {
            date: "desc"
          }
        });
      }

      const typeLabel = config ? config.title : cleanType;
      const isPartial = !!body.isPartial;
      const leadStatus = isPartial ? "abandoned" : "new";

      let leadRecord;
      if (existingLead) {
        leadRecord = await prisma.lead.update({
          where: { id: existingLead.id },
          data: {
            name: `${cleanPrenom} ${cleanNom}`,
            phone: cleanWhatsapp,
            email: cleanEmail,
            type: typeLabel,
            location: cleanVille,
            details: detailsObj as any,
            status: leadStatus,
            utmSource: body.utmSource || existingLead.utmSource,
            utmMedium: body.utmMedium || existingLead.utmMedium,
            utmCampaign: body.utmCampaign || existingLead.utmCampaign
          }
        });
      } else {
        const id = "l_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
        leadRecord = await prisma.lead.create({
          data: {
            id,
            date: new Date().toISOString(),
            name: `${cleanPrenom} ${cleanNom}`,
            phone: cleanWhatsapp,
            email: cleanEmail,
            type: typeLabel,
            location: cleanVille,
            details: detailsObj as any,
            status: leadStatus,
            sessionToken: body.sessionToken || null,
            utmSource: body.utmSource || null,
            utmMedium: body.utmMedium || null,
            utmCampaign: body.utmCampaign || null
          }
        });
      }

      // If it's a partial auto-save, return early without sending emails
      if (isPartial) {
        return NextResponse.json({
          success: true,
          message: "Sauvegarde partielle réussie",
          leadId: leadRecord.id
        });
      }

      // Construct dynamic message copy
      let htmlDetails = "";
      let whatsappMessage = `Bonjour Victoire,
 
Je m'appelle ${cleanPrenom} ${cleanNom}. Je souhaite vous contacter au sujet de : ${typeLabel}.
 
Voici mes coordonnées :
- Localisation : ${cleanVille}
- WhatsApp : ${cleanWhatsapp}
- E-mail : ${cleanEmail}`;

      for (const [label, val] of Object.entries(detailsObj)) {
        htmlDetails += `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">${label}</td>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">${val}</td>
          </tr>
        `;
        whatsappMessage += `\n- ${label} : ${val}`;
      }

      whatsappMessage += `\n\nMerci à vous, en attendant votre réponse.`;

      const emailSubject = `🌱 ${typeLabel} — ${cleanPrenom} ${cleanNom}`;

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
                               <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">WhatsApp / Tél</td>
                    <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">
                      <a href="tel:${cleanWhatsapp}" style="color: #098947; font-weight: bold; text-decoration: none;">${cleanWhatsapp}</a>
                      | 
                      <a href="https://wa.me/${formatWhatsAppNumber(cleanWhatsapp)}" style="color: #098947; font-weight: bold; text-decoration: none;">Discuter sur WhatsApp</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Email</td>
                    <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">
                      <a href="mailto:${cleanEmail}" style="color: #098947; font-weight: bold; text-decoration: none;">${cleanEmail}</a>
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
          email: cleanEmail,
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

    await localStore.addLead({
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
                    <a href="https://wa.me/${formatWhatsAppNumber(cleanPhone)}" style="color: #098947; font-weight: bold; text-decoration: none;">Discuter sur WhatsApp</a>
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
