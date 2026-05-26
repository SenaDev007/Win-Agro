import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { localStore } from "@/lib/db";

// API to fetch and edit products in the catalog (GET / POST / DELETE)
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
    const { action, id, name, description, price, unit, category, isActive } = body;

    // 1. Create action
    if (action === "create") {
      if (!name || !category || !unit) {
        return NextResponse.json({ success: false, error: "Champs obligatoires manquants (name, category, unit)" }, { status: 400 });
      }
      const newProduct = await localStore.createProduct({
        category,
        name,
        description: description || "",
        price: price === "" || price === null || price === undefined ? null : Number(price),
        unit,
        isActive: isActive !== undefined ? Boolean(isActive) : true
      });
      if (newProduct) {
        return NextResponse.json({ success: true, product: newProduct });
      } else {
        return NextResponse.json({ success: false, error: "Impossible de créer le produit" }, { status: 500 });
      }
    }

    // 2. Update action
    if (action === "update") {
      if (!id) {
        return NextResponse.json({ success: false, error: "ID produit manquant" }, { status: 400 });
      }
      const success = await localStore.updateProductDetails(id, {
        category,
        name,
        description,
        price: price === "" || price === null || price === undefined ? null : Number(price),
        unit,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined
      });
      if (success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, error: "Impossible de modifier le produit" }, { status: 500 });
      }
    }

    // 3. Fallback: Quick update (price or active status only)
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
    console.error("❌ Error in admin products API POST:", error);
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
      return NextResponse.json({ success: false, error: "ID produit requis" }, { status: 400 });
    }

    const success = await localStore.deleteProduct(id);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Impossible de supprimer le produit" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("❌ Error in admin products API DELETE:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
