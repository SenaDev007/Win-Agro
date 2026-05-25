import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { localStore } from "@/lib/db";

// API to fetch and edit products in the catalog (GET / POST)
export async function GET() {
  try {
    const products = await localStore.getProducts();
    return NextResponse.json({ success: true, products });
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
    const { id, price, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID produit manquant" }, { status: 400 });
    }

    if (price !== undefined) {
      await localStore.updateProductPrice(id, price === "" || price === null ? null : Number(price));
    }

    if (isActive !== undefined) {
      await localStore.updateProductStatus(id, Boolean(isActive));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
