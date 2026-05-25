import { NextResponse } from "next/server";
import { loginAdmin, logoutAdmin } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ success: false, error: "Mot de passe requis" }, { status: 400 });
    }

    const verified = await loginAdmin(password);

    if (verified) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Mot de passe d'accès invalide" }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE() {
  await logoutAdmin();
  return NextResponse.json({ success: true });
}
