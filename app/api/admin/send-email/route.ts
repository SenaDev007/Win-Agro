import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSession } from "@/lib/session";
import { buildBrandedEmail } from "@/lib/email-templates";
import { prisma } from "@/lib/prisma";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const { to, subject, body, leadId } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ success: false, error: "Champs obligatoires manquants (to, subject, body)" }, { status: 400 });
    }

    if (!resend) {
      console.warn("⚠️ RESEND_API_KEY non configurée dans l'environnement");
      return NextResponse.json({ success: false, error: "Service de messagerie non configuré sur le serveur" }, { status: 500 });
    }

    // Build the HTML using our branded template
    const htmlContent = buildBrandedEmail(body);

    const emailResult = await resend.emails.send({
      from: "Win Agro <contact@winagrotech.com>",
      to: [to.trim()],
      subject: subject,
      html: htmlContent,
    });

    if (emailResult.error) {
      console.error("❌ Erreur Resend lors de l'envoi d'email :", emailResult.error);
      return NextResponse.json({ success: false, error: emailResult.error.message }, { status: 500 });
    }

    // Log the action in the lead's history (notes)
    if (leadId) {
      try {
        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (lead) {
          const timestamp = new Date().toLocaleString("fr-FR", { timeZone: "Africa/Porto-Novo" });
          const logMessage = `[Email de Relance Envoyé - ${timestamp}]\nSujet: ${subject}\n\n`;
          const updatedNotes = lead.notes ? `${logMessage}${lead.notes}` : logMessage;
          await prisma.lead.update({
            where: { id: leadId },
            data: { notes: updatedNotes }
          });
        }
      } catch (dbError) {
        console.error("⚠️ Impossible de mettre à jour les notes du lead :", dbError);
      }
    }

    return NextResponse.json({ success: true, messageId: emailResult.data?.id });
  } catch (error: any) {
    console.error("❌ Exception dans l'API admin send-email :", error);
    return NextResponse.json({ success: false, error: "Erreur serveur interne" }, { status: 500 });
  }
}
