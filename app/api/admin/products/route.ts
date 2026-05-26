import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { localStore } from "@/lib/db";

// GET — fetch all products (public, used by client catalogue modal)
export async function GET() {
  try {
    const products = await localStore.getProducts();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

// POST — create, update, set-promo, or quick patch
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { action, id, name, description, price, unit, category, isActive, promoPrice, promoUntil } = body;

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
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        promoPrice: promoPrice === "" || promoPrice === null || promoPrice === undefined ? null : Number(promoPrice),
        promoUntil: promoUntil || null
      });
      if (newProduct) {
        return NextResponse.json({ success: true, product: newProduct });
      } else {
        return NextResponse.json({ success: false, error: "Impossible de créer le produit" }, { status: 500 });
      }
    }

    // 2. Update action (full product details)
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
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        promoPrice: promoPrice === "" || promoPrice === null || promoPrice === undefined ? null : Number(promoPrice),
        promoUntil: promoUntil || null
      });
      if (success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, error: "Impossible de modifier le produit" }, { status: 500 });
      }
    }

    // 3. Set-promo action (quick promo update without touching other fields)
    if (action === "set-promo") {
      if (!id) {
        return NextResponse.json({ success: false, error: "ID produit manquant" }, { status: 400 });
      }
      const resolvedPromoPrice = promoPrice === "" || promoPrice === null || promoPrice === undefined ? null : Number(promoPrice);
      const resolvedPromoUntil = promoUntil || null;
      const success = await localStore.updateProductPromo(id, resolvedPromoPrice, resolvedPromoUntil);
      if (success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, error: "Impossible de mettre à jour la promo" }, { status: 500 });
      }
    }

    // 4. Fallback: Quick patch (price or active status only)
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

// DELETE — remove a product by id
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
