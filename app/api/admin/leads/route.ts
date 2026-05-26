import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { localStore } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// API to fetch and manage leads (GET / POST to update state)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const leads = await localStore.getLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const { id, status, notes, reminderDate } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "ID requis" }, { status: 400 });
    }

    // Prepare update payload
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (reminderDate !== undefined) updateData.reminderDate = reminderDate || null;

    const lead = await prisma.lead.update({
      where: { id },
      data: updateData
    });

    if (lead) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Lead non trouvé" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("❌ Error updating lead CRM details:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
