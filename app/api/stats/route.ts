import { NextResponse } from "next/server";
import { localStore } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = localStore.getStats();
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
