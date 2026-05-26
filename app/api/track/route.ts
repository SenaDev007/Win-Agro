import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseUserAgent, translateCountry } from "@/lib/analytics-utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path, referrer, sessionToken } = body;

    if (!sessionToken || !path) {
      return NextResponse.json({ success: false, error: "Token et chemin requis" }, { status: 400 });
    }

    // 1. Retrieve Headers (User-Agent, IP Location from Vercel)
    const headers = request.headers;
    const uaString = headers.get("user-agent");
    const rawCountry = headers.get("x-vercel-ip-country");
    const rawCity = headers.get("x-vercel-ip-city");

    const { deviceType, browser } = parseUserAgent(uaString);
    const country = translateCountry(rawCountry);
    const city = rawCity ? decodeURIComponent(rawCity) : "Inconnu";

    // 2. Upsert the Active Session (with last seen heartbeat)
    await prisma.activeSession.upsert({
      where: { token: sessionToken },
      update: {
        lastSeen: new Date(),
        deviceType,
        browser,
        country,
        city
      },
      create: {
        token: sessionToken,
        lastSeen: new Date(),
        createdAt: new Date(),
        deviceType,
        browser,
        country,
        city
      }
    });

    // 3. Insert the Page View
    await prisma.pageView.create({
      data: {
        sessionToken,
        path,
        referrer: referrer || null,
        userAgent: uaString || null,
        deviceType,
        browser,
        country,
        city
      }
    });

    // 4. Background maintenance: clean up active sessions older than 30 minutes
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      await prisma.activeSession.deleteMany({
        where: {
          lastSeen: {
            lt: thirtyMinutesAgo
          }
        }
      });
    } catch (cleanupErr) {
      console.error("❌ Error cleaning up old active sessions:", cleanupErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Error in analytics tracking endpoint:", error);
    return NextResponse.json({ success: false, error: "Erreur lors de l'enregistrement" }, { status: 500 });
  }
}
