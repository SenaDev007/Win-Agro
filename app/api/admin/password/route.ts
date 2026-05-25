import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { localStore } from "@/lib/db";

// POST API to update admin password dynamically
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const { newEmail, newPassword } = await request.json();

    if (newEmail) {
      if (!newEmail.includes("@") || newEmail.length < 5) {
        return NextResponse.json(
          { success: false, error: "Adresse email invalide" },
          { status: 400 }
        );
      }
      await localStore.setAdminEmail(newEmail);
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: "Le mot de passe doit faire au moins 6 caractères" },
          { status: 400 }
        );
      }
      await localStore.setAdminPassword(newPassword);
    }

    console.log("🔐 Admin credentials updated successfully");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
