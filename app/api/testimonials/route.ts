import { NextResponse } from "next/server";
import { localStore } from "@/lib/db";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const notificationEmail = process.env.NOTIFICATION_EMAIL || "contact@winagrotech.com";

function sanitize(str: any): string {
  if (typeof str !== "string") return "";
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
}

export async function GET() {
  try {
    const all = await localStore.getTestimonials();
    const active = all.filter(t => t.isActive);
    return NextResponse.json({ success: true, testimonials: active });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, text, highlight, image } = body;

    const cleanName = sanitize(name);
    const cleanRole = sanitize(role);
    const cleanText = sanitize(text);
    const cleanHighlight = sanitize(highlight);
    const cleanImage = sanitize(image);

    if (!cleanName || !cleanRole || !cleanText) {
      return NextResponse.json({ success: false, error: "Champs requis manquants" }, { status: 400 });
    }

    // Add as pending/inactive by default
    const newTestimonial = await localStore.addTestimonial({
      name: cleanName,
      role: cleanRole,
      text: cleanText,
      highlight: cleanHighlight,
      image: cleanImage || "/Logo Win Agro.png",
      isActive: false
    });

    // Notify the admin via email
    if (resend) {
      try {
        await resend.emails.send({
          from: "Win Agro Site <noreply@winagrotech.com>",
          to: [notificationEmail],
          subject: `⭐ Nouveau témoignage en attente de validation — ${cleanName}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #4A4A4A; max-width: 600px; border: 1px solid #E6F4EC; border-radius: 8px; background-color: #FAFAF3;">
              <h2 style="color: #076B37; border-bottom: 2px solid #098947; padding-bottom: 10px;">Nouveau Témoignage Soumis</h2>
              <p>Un visiteur a soumis un témoignage sur le site et attend votre validation :</p>
              
              <div style="background-color: #E6F4EC; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-weight: bold; color: #076B37;">Auteur : ${cleanName}</p>
                <p style="margin: 0 0 10px 0; font-style: italic;">Activité/Ville : ${cleanRole}</p>
                <p style="margin: 0 0 10px 0; font-size: 14px;">"${cleanText}"</p>
                ${cleanHighlight ? `<p style="margin: 0; font-size: 13px; color: #098947; font-weight: bold;">Phrase mise en avant : ${cleanHighlight}</p>` : ""}
              </div>
              
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://admin.winagrotech.com" style="background-color: #098947; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Accéder au Backoffice pour valider
                </a>
              </div>
              
              <footer style="margin-top: 40px; font-size: 12px; color: #7A7A7A; text-align: center; border-top: 1px solid #E6F4EC; padding-top: 15px;">
                © 2026 Win Agro Agri Tech Solutions. Tous droits réservés.
              </footer>
            </div>
          `
        });
      } catch (emailError) {
        console.error("❌ Erreur lors de l'envoi de l'email témoignage :", emailError);
      }
    }

    return NextResponse.json({ success: true, testimonial: newTestimonial });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
