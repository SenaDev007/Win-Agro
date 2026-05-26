import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getSessionTimeline } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionToken = searchParams.get("sessionToken");

    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "Token de session requis" }, { status: 400 });
    }

    const timeline = await getSessionTimeline(sessionToken);
    return NextResponse.json({ success: true, timeline });
  } catch (error: any) {
    console.error("❌ Error in admin/leads/timeline route:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
