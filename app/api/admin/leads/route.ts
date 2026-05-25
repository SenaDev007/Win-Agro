import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { localStore } from "@/lib/db";

export const dynamic = "force-dynamic";

// API to fetch and manage leads (GET / POST to update state)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const leads = localStore.getLeads();
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

    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Champs manquants" }, { status: 400 });
    }

    const updated = localStore.updateLeadStatus(id, status);
    if (updated) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Lead non trouvé" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
