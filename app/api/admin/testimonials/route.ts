import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { localStore } from "@/lib/db";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

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

    // Support both JSON and multipart/form-data uploads
    let id = "";
    let cleanText = "";
    let cleanHighlight = "";
    let cleanImage = "/Logo Win Agro.png";
    let cleanName = "";
    let cleanRole = "";
    let cleanIsActive = true;

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      id = (formData.get("id") as string) ?? "";
      const textRaw = (formData.get("text") as string) ?? "";
      const highlightRaw = (formData.get("highlight") as string) ?? "";
      const nameRaw = (formData.get("name") as string) ?? "";
      const roleRaw = (formData.get("role") as string) ?? "";
      const isActiveRaw = formData.get("isActive");
      cleanIsActive = isActiveRaw === "true";

      const imageFile = formData.get("image") as File | null;
      if (imageFile && imageFile.size > 0) {
        if (imageFile.size > 5 * 1024 * 1024) {
          return NextResponse.json({ success: false, error: "Image trop volumineuse (max 5 MB)" }, { status: 400 });
        }
        const ext = imageFile.name.split(".").pop() || "png";
        const blobName = `testimonials/${uuidv4()}.${ext}`;
        const { url } = await put(blobName, imageFile, { access: "public" });
        cleanImage = url;
      } else {
        const imageUrl = (formData.get("image") as string) ?? "/Logo Win Agro.png";
        cleanImage = sanitize(imageUrl);
      }

      cleanText = sanitize(textRaw);
      cleanHighlight = sanitize(highlightRaw);
      cleanName = sanitize(nameRaw);
      cleanRole = sanitize(roleRaw);
    } else {
      // Fallback to JSON body
      const body = await request.json();
      const { id: bid, text, highlight, image, name, role, isActive } = body;
      id = bid ?? "";
      cleanText = sanitize(text);
      cleanHighlight = sanitize(highlight);
      cleanImage = sanitize(image) || "/Logo Win Agro.png";
      cleanName = sanitize(name);
      cleanRole = sanitize(role);
      cleanIsActive = !!isActive;
    }



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
        isActive: cleanIsActive
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
        isActive: cleanIsActive
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
