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

    const testimonials = localStore.getTestimonials();
    return NextResponse.json({ success: true, testimonials });
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
    const { id, text, highlight, image, name, role, isActive } = body;

    const cleanText = sanitize(text);
    const cleanHighlight = sanitize(highlight);
    const cleanImage = sanitize(image) || "/Logo Win Agro.png";
    const cleanName = sanitize(name);
    const cleanRole = sanitize(role);

    if (!cleanText || !cleanName || !cleanRole) {
      return NextResponse.json({ success: false, error: "Champs requis manquants" }, { status: 400 });
    }

    if (id) {
      // Update
      const success = localStore.updateTestimonial({
        id,
        text: cleanText,
        highlight: cleanHighlight,
        image: cleanImage,
        name: cleanName,
        role: cleanRole,
        isActive: !!isActive
      });
      if (success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, error: "Témoignage non trouvé" }, { status: 404 });
      }
    } else {
      // Create
      const newT = localStore.addTestimonial({
        text: cleanText,
        highlight: cleanHighlight,
        image: cleanImage,
        name: cleanName,
        role: cleanRole,
        isActive: isActive !== undefined ? !!isActive : true
      });
      return NextResponse.json({ success: true, testimonial: newT });
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID requis" }, { status: 400 });
    }

    const success = localStore.deleteTestimonial(id);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Témoignage non trouvé" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
