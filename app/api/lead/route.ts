import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadFormSchema, modalLeadSchema, serviceLabels } from "@/lib/validations";

// Initialize Resend with API Key (if provided in environment variables)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const notificationEmail = process.env.NOTIFICATION_EMAIL || "contact@winagro.bj";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Differentiate between old homepage form and new modal form
    const isModalForm = body && typeof body === "object" && "type" in body;

    if (isModalForm) {
      // 1. Server-side Validation for Modal Leads
      const validation = modalLeadSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            errors: validation.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }

      const data = validation.data;
      const { prenom, nom, whatsapp, ville, type } = data;
      const typeLabel = type === "accompagnement" ? "Accompagnement Projet" : type === "formation" ? "Inscription Formation" : "Consultation & Diagnostic";

      console.log(`🌱 Lead reçu de type [${typeLabel}] :`, { prenom, nom, whatsapp, ville });

      let htmlDetails = "";
      let emailSubject = "";
      let whatsappMessage = "";

      if (type === "accompagnement") {
        const { typeElevage, experience, besoin, budget } = data;
        emailSubject = `🌾 Projet d'Élevage [Accompagnement] — ${prenom} ${nom}`;
        htmlDetails = `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Type d'élevage</td>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">${typeElevage}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Expérience</td>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">${experience}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Besoin principal</td>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">${besoin}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Budget estimé</td>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">${budget || "Non spécifié"}</td>
          </tr>
        `;

        whatsappMessage = `Bonjour Victoire,

Je m'appelle ${prenom} ${nom}. Je souhaite être accompagné(e) sur mon projet d'élevage au Bénin.

Voici mes informations :
- Type d'élevage : ${typeElevage}
- Niveau d'expérience : ${experience}
- Besoin principal : ${besoin}
- Mon budget : ${budget || "Non spécifié"}
- Localisation : ${ville}
- WhatsApp : ${whatsapp}`;
      } else if (type === "consultation") {
        const { typeElevageActuel, problemePrincipal, depuisCombienDeTemps, urgence } = data;
        emailSubject = `🔍 Consultation & Diagnostic — ${prenom} ${nom}`;
        htmlDetails = `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Type d'élevage actuel</td>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">${typeElevageActuel}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Problème principal</td>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">${problemePrincipal}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Depuis combien de temps</td>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">${depuisCombienDeTemps}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Urgence</td>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; color: #dc2626; font-weight: bold;">${urgence}</td>
          </tr>
        `;

        whatsappMessage = `Bonjour Victoire,

Je m'appelle ${prenom} ${nom}. Je souhaite une consultation et un diagnostic de ma ferme.

Voici ma situation :
- Type d'élevage : ${typeElevageActuel}
- Problème principal : ${problemePrincipal}
- Depuis : ${depuisCombienDeTemps}
- Urgence : ${urgence}
- Localisation : ${ville}
- WhatsApp : ${whatsapp}

J'attends votre contact pour la suite. Merci !`;
      } else {
        const { formationSouhaitee, modePreferee, disponibilite } = data;
        emailSubject = `📚 Inscription Formation [${formationSouhaitee}] — ${prenom} ${nom}`;
        htmlDetails = `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Formation souhaitée</td>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">${formationSouhaitee}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Mode préféré</td>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">${modePreferee}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Disponibilité</td>
            <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">${disponibilite}</td>
          </tr>
        `;

        whatsappMessage = `Bonjour Victoire,

Je m'appelle ${prenom} ${nom}. Je souhaite m'inscrire à une formation en élevage agricole chez Win Agro.

Voici mes informations :
- Formation souhaitée : ${formationSouhaitee}
- Mode d'apprentissage : ${modePreferee}
- Disponibilité : ${disponibilite}
- Localisation : ${ville}
- WhatsApp : ${whatsapp}`;
      }

      // Send email via Resend
      let emailSent = false;
      if (resend) {
        try {
          const emailResult = await resend.emails.send({
            from: "Win Agro Site <noreply@winagro.bj>",
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
                    <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">${prenom} ${nom}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">WhatsApp / Tél</td>
                    <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">
                      <a href="tel:${whatsapp}" style="color: #098947; font-weight: bold; text-decoration: none;">${whatsapp}</a>
                      | 
                      <a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}" style="color: #098947; font-weight: bold; text-decoration: none;">Discuter sur WhatsApp</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #E6F4EC; font-weight: bold;">Localisation / Ville</td>
                    <td style="padding: 8px; border-bottom: 1px solid #E6F4EC;">${ville}</td>
                  </tr>
                  ${htmlDetails}
                </table>
                
                <div style="margin-top: 30px; padding: 15px; background-color: #FFFBE0; border-left: 4px solid #FDDD00; border-radius: 4px;">
                  <p style="margin: 0; font-size: 14px; color: #C8A800; font-weight: bold;">Action recommandée :</p>
                  <p style="margin: 5px 0 0 0; font-size: 14px;">Recontacte ce prospect sous 24h par appel direct ou WhatsApp. C'est le secret pour convertir à coup sûr ! 🌱</p>
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

      return NextResponse.json({
        success: true,
        message: "Victoire vous recontacte dans les 24h.",
        data: {
          prenom,
          nom,
          whatsapp,
          ville,
          type,
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

    console.log("🌱 Lead reçu (Classique) :", { fullName, phone, service: serviceLabel, message });

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

    return NextResponse.json({
      success: true,
      message: "Reçu ✓ Victoire te contacte dans les 24h.",
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
