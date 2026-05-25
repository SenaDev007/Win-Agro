import { NextResponse } from "next/server";
import { loginAdmin, logoutAdmin } from "@/lib/session";
import { localStore } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

    // Check if IP is locked
    const lockout = localStore.isIpLocked(ip);
    if (lockout.locked) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Trop de tentatives échouées. IP temporairement bloquée pour encore ${lockout.remainingMin} minute(s).` 
        }, 
        { status: 429 }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ success: false, error: "Mot de passe requis" }, { status: 400 });
    }

    const verified = await loginAdmin(password);

    // Track the attempt (success or fail)
    localStore.trackLoginAttempt(ip, verified);

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
