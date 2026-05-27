import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { localStore } from "@/lib/db";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

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

    const testimonials = await localStore.getTestimonials();
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
    let cleanImage = "";
    let cleanName = "";
    let cleanRole = "";
    let cleanIsActive = true;
    let cleanAudioUrl: string | null = null;

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

      // 1. Process image file upload
      const imageFile = formData.get("image");
      const isFile = imageFile && typeof imageFile !== "string" && "size" in imageFile;
      if (isFile && (imageFile as any).size > 0) {
        const fileObj = imageFile as File;
        if (fileObj.size > 5 * 1024 * 1024) {
          return NextResponse.json({ success: false, error: "Image trop volumineuse (max 5 MB)" }, { status: 400 });
        }
        const ext = fileObj.name.split(".").pop() || "png";
        const blobName = `testimonials/${uuidv4()}.${ext}`;
        const { url } = await put(blobName, fileObj, { access: "public", contentType: fileObj.type });
        cleanImage = url;
      } else {
        const imageUrl = formData.get("image") as string;
        cleanImage = (imageUrl && imageUrl !== "undefined" && imageUrl !== "null" && imageUrl !== "") ? sanitize(imageUrl) : "";
      }

      // 2. Process audio file upload
      const audioFile = formData.get("audio");
      const isAudioFile = audioFile && typeof audioFile !== "string" && "size" in audioFile;
      if (isAudioFile && (audioFile as any).size > 0) {
        const fileObj = audioFile as File;
        if (fileObj.size > 15 * 1024 * 1024) {
          return NextResponse.json({ success: false, error: "Fichier audio trop volumineux (max 15 MB)" }, { status: 400 });
        }
        const ext = fileObj.name.split(".").pop() || "mp3";
        const blobName = `testimonials-audio/${uuidv4()}.${ext}`;
        const { url } = await put(blobName, fileObj, { access: "public", contentType: fileObj.type || "audio/mpeg" });
        cleanAudioUrl = url;
      } else {
        const audioUrl = formData.get("audioUrl") as string;
        cleanAudioUrl = (audioUrl && audioUrl !== "undefined" && audioUrl !== "null" && audioUrl !== "") ? sanitize(audioUrl) : null;
      }

      cleanText = sanitize(textRaw);
      cleanHighlight = sanitize(highlightRaw);
      cleanName = sanitize(nameRaw);
      cleanRole = sanitize(roleRaw);
    } else {
      // Fallback to JSON body
      const body = await request.json();
      const { id: bid, text, highlight, image, name, role, isActive, audioUrl } = body;
      id = bid ?? "";
      cleanText = sanitize(text);
      cleanHighlight = sanitize(highlight);
      cleanImage = (image && image !== "undefined" && image !== "null" && image !== "") ? sanitize(image) : "";
      cleanName = sanitize(name);
      cleanRole = sanitize(role);
      cleanIsActive = !!isActive;
      cleanAudioUrl = audioUrl ? sanitize(audioUrl) : null;
    }

    if ((!cleanText && !cleanAudioUrl) || !cleanName || !cleanRole) {
      return NextResponse.json({ success: false, error: "Champs requis manquants (le texte ou l'audio est requis, ainsi que le nom et le rôle)" }, { status: 400 });
    }

    if (id) {
      // Update
      const success = await localStore.updateTestimonial({
        id,
        text: cleanText,
        highlight: cleanHighlight,
        image: cleanImage,
        name: cleanName,
        role: cleanRole,
        isActive: cleanIsActive,
        audioUrl: cleanAudioUrl
      });
      if (success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, error: "Témoignage non trouvé" }, { status: 404 });
      }
    } else {
      // Create
      const newT = await localStore.addTestimonial({
        text: cleanText,
        highlight: cleanHighlight,
        image: cleanImage,
        name: cleanName,
        role: cleanRole,
        isActive: cleanIsActive,
        audioUrl: cleanAudioUrl
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

    const success = await localStore.deleteTestimonial(id);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Témoignage non trouvé" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
