import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { localStore } from "@/lib/db";

export const dynamic = "force-dynamic";

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

    const forms = localStore.getFormConfigs();
    return NextResponse.json({ success: true, forms });
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
    const { key, title, heroBgUrl, description, fields, isActive, isNew } = body;

    const cleanTitle = sanitize(title);
    const cleanDescription = sanitize(description);
    const cleanHeroBgUrl = sanitize(heroBgUrl);

    if (!cleanTitle || !cleanDescription || !key) {
      return NextResponse.json({ success: false, error: "Champs requis manquants" }, { status: 400 });
    }

    const processedFields = Array.isArray(fields)
      ? fields.map((f: any) => ({
          name: sanitize(f.name).replace(/\s+/g, "_"),
          label: sanitize(f.label),
          type: (f.type === "select" ? "select" : "text") as "text" | "select",
          options: Array.isArray(f.options) ? f.options.map((o: any) => sanitize(o)).filter(Boolean) : undefined,
          required: !!f.required
        }))
      : [];

    const newConfig = {
      key: sanitize(key).replace(/\s+/g, "_").toLowerCase(),
      title: cleanTitle,
      heroBgUrl: cleanHeroBgUrl || undefined,
      description: cleanDescription,
      fields: processedFields,
      isActive: isActive !== undefined ? !!isActive : true
    };

    if (!isNew) {
      // Update
      const success = localStore.updateFormConfig(newConfig);
      if (success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, error: "Configuration non trouvée" }, { status: 404 });
      }
    } else {
      // Create
      const success = localStore.addFormConfig(newConfig);
      if (success) {
        return NextResponse.json({ success: true, config: newConfig });
      } else {
        return NextResponse.json({ success: false, error: "Un formulaire avec cette clé existe déjà" }, { status: 400 });
      }
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
      return NextResponse.json({ success: false, error: "Clé requise" }, { status: 400 });
    }

    const success = localStore.deleteFormConfig(key);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Configuration non trouvée" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
