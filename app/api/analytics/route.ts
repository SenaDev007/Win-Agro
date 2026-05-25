import { NextResponse } from "next/server";
import { getAnalyticsData } from "@/lib/analytics";

export async function GET(request: Request) {
  try {
    // Simple basic auth verification for security (can check cookie, headers or token later)
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    // Replace this check with proper admin session in production
    if (!token && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const data = await getAnalyticsData();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
