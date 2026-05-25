import { NextResponse } from "next/server";
import { localStore } from "@/lib/db";

export async function GET() {
  try {
    const all = localStore.getTestimonials();
    const active = all.filter(t => t.isActive);
    return NextResponse.json({ success: true, testimonials: active });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
