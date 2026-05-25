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

    const services = localStore.getServices();
    return NextResponse.json({ success: true, services });
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
    const { key, title, hook, problem, bullets, availability, cta, isPremium, isActive, isNew } = body;

    const cleanTitle = sanitize(title);
    const cleanHook = sanitize(hook);
    const cleanProblem = sanitize(problem);
    const cleanAvailability = sanitize(availability);
    const cleanCta = sanitize(cta);
    
    let cleanBullets: string[] = [];
    if (Array.isArray(bullets)) {
      cleanBullets = bullets.map(b => sanitize(b)).filter(Boolean);
    }

    if (!cleanTitle || !cleanHook || !cleanProblem || !cleanCta) {
      return NextResponse.json({ success: false, error: "Champs requis manquants" }, { status: 400 });
    }

    if (key && !isNew) {
      // Update
      const success = localStore.updateService({
        key,
        title: cleanTitle,
        hook: cleanHook,
        problem: cleanProblem,
        bullets: cleanBullets,
        availability: cleanAvailability,
        cta: cleanCta,
        isPremium: !!isPremium,
        isActive: !!isActive
      });
      if (success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, error: "Service non trouvé" }, { status: 404 });
      }
    } else {
      // Create
      const generatedKey = key ? sanitize(key).replace(/\s+/g, "_").toLowerCase() : undefined;
      const newS = localStore.addService({
        key: generatedKey,
        title: cleanTitle,
        hook: cleanHook,
        problem: cleanProblem,
        bullets: cleanBullets,
        availability: cleanAvailability,
        cta: cleanCta,
        isPremium: !!isPremium,
        isActive: isActive !== undefined ? !!isActive : true
      });
      return NextResponse.json({ success: true, service: newS });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ success: false, error: "Clé de service requise" }, { status: 400 });
    }

    const success = localStore.deleteService(key);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Service non trouvé" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
