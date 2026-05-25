import { NextResponse } from "next/server";
import { localStore } from "@/lib/db";

export async function GET() {
  try {
    const all = localStore.getServices();
    const active = all.filter(s => s.isActive);
    return NextResponse.json({ success: true, services: active });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
