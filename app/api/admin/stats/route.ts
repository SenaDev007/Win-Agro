import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { localStore } from "@/lib/db";

function sanitize(str: any): string {
  if (typeof str !== "string") return "";
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const stats = localStore.getStats();
    return NextResponse.json({ success: true, stats });
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

    const body = await request.json();
    const { id, value, suffix, label, subText } = body;

    if (!id || value === undefined || !label) {
      return NextResponse.json({ success: false, error: "Champs requis manquants" }, { status: 400 });
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
      return NextResponse.json({ success: false, error: "Valeur invalide" }, { status: 400 });
    }

    const cleanSuffix = sanitize(suffix);
    const cleanLabel = sanitize(label);
    const cleanSubText = sanitize(subText);

    const success = localStore.updateStat({
      id,
      value: numValue,
      suffix: cleanSuffix,
      label: cleanLabel,
      subText: cleanSubText
    });

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Statistique non trouvée" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
