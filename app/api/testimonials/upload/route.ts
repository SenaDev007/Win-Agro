import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ success: false, error: "Aucun fichier fourni" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Image trop volumineuse (max 5 MB)" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "png";
    const blobName = `testimonials/public-${uuidv4()}.${ext}`;
    const { url } = await put(blobName, file, { access: "public" });

    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error("❌ Error in public testimonials upload:", error);
    return NextResponse.json({ success: false, error: "Erreur lors du téléversement" }, { status: 500 });
  }
}
