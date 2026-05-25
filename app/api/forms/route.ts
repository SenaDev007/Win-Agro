import { NextResponse } from "next/server";
import { localStore } from "@/lib/db";

export async function GET() {
  try {
    const configs = localStore.getFormConfigs().filter(f => f.isActive);
    return NextResponse.json({ success: true, forms: configs });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
